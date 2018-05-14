import * as bodyParser from "body-parser";
import * as express from "express";
import * as querystring from "querystring";
import * as supertest from "supertest";
import blockchainMiddleware, { Invoice, Piixpay } from "./";

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
        api: new Piixpay({
          key: "xxx",
        }),
        saveInvoice,
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
    const response = await server.get(
      `/payment/qr?${querystring.stringify({
        payload: "bitcoin:bmitnJQ1OqzZzOGv6abovJxdO1PuSnqn?amount=0.00450000",
      })}`,
    );

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
