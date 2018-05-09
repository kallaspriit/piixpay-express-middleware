import * as bodyParser from "body-parser";
import * as express from "express";
import * as querystring from "querystring";
import * as supertest from "supertest";
import blockchainMiddleware, { Invoice } from "./";

const RECEIVING_ADDRESS = "2FupTEd3PDF7HVxNrzNqQGGoWZA4rqiphq";

// invoices "database" emulated with a simple array
const invoiceDatabase: Invoice[] = [];

let server: supertest.SuperTest<supertest.Test>;

// tslint:disable:no-magic-numbers
describe("middleware", () => {
  beforeEach(() => {
    // create app
    const app = express();

    // parse application/x-www-form-urlencoded and  application/json
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // use the blockchain middleware
    app.use(
      "/payment",
      blockchainMiddleware({
        saveInvoice,
        loadInvoice,
      }),
    );

    server = supertest(app);
  });

  afterEach(() => {
    // "clear" the database
    while (invoiceDatabase.length > 0) {
      invoiceDatabase.pop();
    }
  });

  it("should provide qr code rendering", async () => {
    // build qr code url
    const qrCodeParameters = {
      address: RECEIVING_ADDRESS,
      amount: 1,
      message: "Test",
    };

    const response = await server.get(`/payment/qr?${querystring.stringify(qrCodeParameters)}`);

    expect(response.type).toEqual("image/png");
    expect(response.body).toMatchSnapshot();
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

async function loadInvoice(transactionKey: string): Promise<Invoice | undefined> {
  const invoice = invoiceDatabase.find(item => item.transactionKey === transactionKey);

  if (!invoice) {
    return undefined;
  }

  return invoice;
}
