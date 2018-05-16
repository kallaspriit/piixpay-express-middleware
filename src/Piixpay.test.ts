import Axios from "axios";
import MockServer from "axios-mock-adapter";
import { Invoice } from "./index";
// import * as HttpStatus from "http-status-codes";
// import { ILogger } from "ts-log";

// const CALLBACK_URL = "https://example.com";
// const RECEIVING_ADDRESS = "2FupTEd3PDF7HVxNrzNqQGGoWZA4rqiphq";
// const API_KEY = "xxx";
// const XPUB = "yyy";
// const SECRET = "zzz";

let mockServer: MockServer;

describe("Blockchain", () => {
  beforeEach(() => {
    mockServer = new MockServer(Axios);
  });

  afterEach(() => {
    mockServer.restore();
  });

  it("should work", async () => {
    expect(true).toBe(true);
  });

  // it("should generate a new receiving address", async () => {
  //   mockServer.onGet(/receive/).reply(HttpStatus.OK, {
  //     address: RECEIVING_ADDRESS,
  //     index: 0,
  //     callback: CALLBACK_URL,
  //   });

  //   const blockchain = new Piixpay({
  //     apiKey: API_KEY,
  //     xPub: XPUB,
  //   });

  //   const receivingAddress = await blockchain.generateReceivingAddress(CALLBACK_URL);

  //   expect(receivingAddress).toMatchSnapshot();
  // });

  // it("should throw error when generating receving address and getting a non 2xx response", async () => {
  //   mockServer.onGet(/receive/).reply(HttpStatus.BAD_REQUEST, "Bad request");

  //   const blockchain = new Piixpay({
  //     apiKey: API_KEY,
  //     xPub: XPUB,
  //     gapLimit: 20, // we can provide custom gap limit
  //   });

  //   await expect(blockchain.generateReceivingAddress(CALLBACK_URL)).rejects.toMatchSnapshot();
  // });

  // it("should create a new invoice with receiving address", async () => {
  //   mockServer.onGet(/receive/).reply(HttpStatus.OK, {
  //     address: RECEIVING_ADDRESS,
  //     index: 0,
  //     callback: CALLBACK_URL,
  //   });

  //   const blockchain = new Piixpay({
  //     apiKey: API_KEY,
  //     xPub: XPUB,
  //   });

  //   const invoice = await blockchain.createInvoice({
  //     dueAmount: 1,
  //     message: "Test invoice",
  //     secret: SECRET,
  //     callbackUrl: CALLBACK_URL,
  //   });

  //   expect(processInvoiceForSnapshot(invoice)).toMatchSnapshot();
  // });

  // it("should accept custom logger", async () => {
  //   mockServer.onGet(/receive/).reply(HttpStatus.OK, {
  //     address: RECEIVING_ADDRESS,
  //     index: 0,
  //     callback: CALLBACK_URL,
  //   });

  //   const mockLogger: ILogger = {
  //     trace: jest.fn(),
  //     debug: jest.fn(),
  //     info: jest.fn(),
  //     warn: jest.fn(),
  //     error: jest.fn(),
  //   };

  //   const blockchain = new Piixpay(
  //     {
  //       apiKey: API_KEY,
  //       xPub: XPUB,
  //     },
  //     mockLogger,
  //   );

  //   await blockchain.createInvoice({
  //     dueAmount: 2.5,
  //     message: "Another invoice",
  //     secret: SECRET,
  //     callbackUrl: CALLBACK_URL,
  //   });

  //   // tslint:disable-next-line:no-any
  //   expect((mockLogger.info as any).mock.calls).toMatchSnapshot();
  // });
});

export function processInvoiceForSnapshot(invoice: Invoice): Invoice {
  invoice.info.created_time = new Date(0).toISOString();
  invoice.info.status_time = new Date(0).toISOString();

  return invoice;
}
