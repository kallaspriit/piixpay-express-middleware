import Axios from "axios";
import MockServer from "axios-mock-adapter";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as HttpStatus from "http-status-codes";
import * as querystring from "querystring";
import * as supertest from "supertest";
import { ILogger } from "ts-log";
import middleware, {
  Coin,
  IInvoiceInfo,
  Invoice,
  InvoiceAmountStatus,
  InvoicePaymentStatus,
  Piixpay,
  PiixpayInvoiceStatus,
} from "./";
import { processInvoiceForSnapshot } from "./Piixpay.test";

// invoices "database" emulated with a simple array
const invoiceDatabase: Invoice[] = [];

let server: supertest.SuperTest<supertest.Test>;
let mockServer: MockServer;

describe("middleware", () => {
  beforeEach(() => {
    // create axios mock server
    mockServer = new MockServer(Axios);

    // create app
    const app = express();

    // parse application/x-www-form-urlencoded and  application/json
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // use the blockchain middleware
    app.use(
      "/payment",
      middleware({
        api: new Piixpay({
          key: "xxx",
        }),
        saveInvoice,
      }),
    );

    server = supertest(app);
  });

  afterEach(() => {
    // remove the mock server
    mockServer.restore();

    // "clear" the database
    while (invoiceDatabase.length > 0) {
      invoiceDatabase.pop();
    }
  });

  it("should provide qr code rendering", async () => {
    const response = await server.get(
      `/payment/qr?${querystring.stringify({
        payload: "bitcoin:bmitnJQ1OqzZzOGv6abovJxdO1PuSnqn?amount=0.00450000",
      })}`,
    );

    expect(response.type).toEqual("image/png");
    expect(response.body).toMatchSnapshot();
  });

  it("should accept custom logger", async () => {
    const mockLogger: ILogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    middleware({
      api: new Piixpay({
        key: "xxx",
      }),
      saveInvoice,
      log: mockLogger,
    });
  });

  it("should handle valid payment updates", async () => {
    const invoice = new Invoice(getMockInvoiceInfo());

    invoiceDatabase.push(invoice);

    // mock get invoice response
    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
      ok: true,
      invoice: getMockInvoiceInfo({
        status: PiixpayInvoiceStatus.F, // full
        received_coin: invoice.due.coin, // exact amount
      }),
    });

    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: invoice.transactionKey,
    });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.text).toMatchSnapshot();

    const updatedInvoice = invoiceDatabase[0];

    expect(updatedInvoice.isPaid).toBe(true);
    expect(updatedInvoice.isComplete).toBe(true);
    expect(updatedInvoice.paymentStatus).toBe(InvoicePaymentStatus.FULL);
    expect(updatedInvoice.amountStatus).toBe(InvoiceAmountStatus.EXACT);

    expect(processInvoicesDatabaseForSnapshot(invoiceDatabase)).toMatchSnapshot();
  });

  it("should handle underpayment", async () => {
    const invoice = new Invoice(getMockInvoiceInfo());

    invoiceDatabase.push(invoice);

    // mock get invoice response
    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
      ok: true,
      invoice: getMockInvoiceInfo({
        status: PiixpayInvoiceStatus.F,
        received_coin: invoice.due.coin * 0.5, // lower amount
      }),
    });

    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: invoice.transactionKey,
    });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.text).toMatchSnapshot();

    const updatedInvoice = invoiceDatabase[0];

    expect(updatedInvoice.isPaid).toBe(true);
    expect(updatedInvoice.isComplete).toBe(true);
    expect(updatedInvoice.paymentStatus).toBe(InvoicePaymentStatus.FULL);
    expect(updatedInvoice.amountStatus).toBe(InvoiceAmountStatus.UNDERPAID);

    expect(processInvoicesDatabaseForSnapshot(invoiceDatabase)).toMatchSnapshot();
  });

  it("should handle overpayment", async () => {
    const invoice = new Invoice(getMockInvoiceInfo());

    invoiceDatabase.push(invoice);

    // mock get invoice response
    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
      ok: true,
      invoice: getMockInvoiceInfo({
        status: PiixpayInvoiceStatus.F,
        received_coin: invoice.due.coin * 2, // higher amount
      }),
    });

    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: invoice.transactionKey,
    });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.text).toMatchSnapshot();

    const updatedInvoice = invoiceDatabase[0];

    expect(updatedInvoice.isPaid).toBe(true);
    expect(updatedInvoice.isComplete).toBe(true);
    expect(updatedInvoice.paymentStatus).toBe(InvoicePaymentStatus.FULL);
    expect(updatedInvoice.amountStatus).toBe(InvoiceAmountStatus.OVERPAID);

    expect(processInvoicesDatabaseForSnapshot(invoiceDatabase)).toMatchSnapshot();
  });

  it("should return bad request if the transaction key is missing", async () => {
    const response = await server.post(`/payment/handle-payment`).send({
      // no transaction key
    });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.text).toMatchSnapshot();
  });

  it("should return bad request if the transaction key does not have correct format", async () => {
    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: "xxx",
    });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.text).toMatchSnapshot();
  });

  it("should return not found if the invoice could not be found", async () => {
    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    });

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    expect(response.text).toMatchSnapshot();
  });

  it("should return internal error if the remote api fails, includes error data if a string is provided", async () => {
    mockServer.onGet(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR, "remote error message");

    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    });

    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.text).toMatchSnapshot();
  });

  it("should return internal error if the remote api fails, uses error if no data is provided", async () => {
    mockServer.onGet(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR);

    const response = await server.post(`/payment/handle-payment`).send({
      transaction_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    });

    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.text).toMatchSnapshot();
  });
});

async function saveInvoice(invoice: Invoice): Promise<void> {
  const existingInvoiceIndex = invoiceDatabase.findIndex(item => item.transactionKey === invoice.transactionKey);

  if (existingInvoiceIndex !== -1) {
    invoiceDatabase[existingInvoiceIndex] = invoice;
  } else {
    invoiceDatabase.push(invoice);
  }
}

function processInvoicesDatabaseForSnapshot(invoices: Invoice[]): Invoice[] {
  invoices.forEach(processInvoiceForSnapshot);

  return invoices;
}

function getMockInvoiceInfo(override: Partial<IInvoiceInfo> = {}): IInvoiceInfo {
  return {
    transaction_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: PiixpayInvoiceStatus.N, // new
    status_time: "2018-05-15 15:51:05 +00:00",
    status_utime: 1526399465,
    created_time: "2018-05-15 14:10:26 +00:00",
    created_utime: 1526393426,
    receiver_name: "Dag University",
    receiver_address: null,
    receiver_iban: "DA12345EFAEJBF242424524",
    coin: Coin.BTC,
    sum_eur: 5,
    total_eur: 30.05,
    total_btc: 0.0043,
    fees_eur: 0.05,
    fees_btc: 0.0001,
    bank_fees_eur: 25,
    bank_fees_btc: 0.0035,
    received_btc: 0,
    missing_btc: 0.0043,
    rate: 7325.43,
    bitcoin_address: "iURIGqIuMNu2W2H89jOqqXmbu3RmdBz5",
    description: "Test payment",
    reference: null,
    contact_email: "test@example.com",
    contact_phone: null,
    contact_language: "",
    payer_name: "John Rambo",
    payer_document: "019ae981-713f-4eb8-860f-c11d48f29a1c",
    due_date: null,
    qrc_image_url: "https://www.piix.eu/web/qr/wvmvw317lls3j9wag68sntztw2wvnauw/code.jpg",
    qrc_endpoint_url: "http://www.piix.eu/web/qr/wvmvw317lls3j9wag68sntztw2wvnauw/redirect/",
    payment_url: "bitcoin://iURIGqIuMNu2W2H89jOqqXmbu3RmdBz5?amount=0.00430000",
    total_coin: 0.0043,
    fees_coin: 0.0001,
    bank_fees_coin: 0.0035,
    received_coin: 0,
    missing_coin: 0.0043,
    coin_address: "iURIGqIuMNu2W2H89jOqqXmbu3RmdBz5",
    ...override,
  };
}
