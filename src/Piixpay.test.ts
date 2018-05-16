import Axios from "axios";
import MockServer from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import { ILogger } from "ts-log";
import { Piixpay } from "./index";
import { getMockInvoiceInfo, processInvoiceForSnapshot } from "./middleware.test";

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

  it("should create a new invoice", async () => {
    mockServer.onPost(/invoice/).reply(HttpStatus.OK, {
      ok: true,
      invoice: getMockInvoiceInfo(),
    });

    const blockchain = new Piixpay({
      key: "xxx",
    });

    const invoice = await blockchain.createInvoice({
      sum_eur: 5,
      description: "Test",
      payer_name: "John Rambo",
      payer_document: "123456",
      contact_email: "john@rambo.com",
    });

    expect(processInvoiceForSnapshot(invoice)).toMatchSnapshot();
  });

  it("should throw error if crating invoice failed", async () => {
    mockServer.onPost(/invoice/).reply(HttpStatus.OK, {
      ok: false,
      error: "creating invoice failed",
      desc: "internal error occured",
    });

    const blockchain = new Piixpay({
      key: "xxx",
    });

    await expect(
      blockchain.createInvoice({
        sum_eur: 5,
        description: "Test",
        payer_name: "John Rambo",
        payer_document: "123456",
        contact_email: "john@rambo.com",
      }),
    ).rejects.toMatchSnapshot();
  });

  it("should throw error when creating invoice if server returns error", async () => {
    mockServer.onPost(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");

    const blockchain = new Piixpay({
      key: "xxx",
    });

    await expect(
      blockchain.createInvoice({
        sum_eur: 5,
        description: "Test",
        payer_name: "John Rambo",
        payer_document: "123456",
        contact_email: "john@rambo.com",
      }),
    ).rejects.toMatchSnapshot();
  });

  it("should return invoice info", async () => {
    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
      ok: true,
      invoice: getMockInvoiceInfo(),
    });

    const blockchain = new Piixpay({
      key: "xxx",
    });

    const invoice = await blockchain.getInvoice("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

    expect(processInvoiceForSnapshot(invoice)).toMatchSnapshot();
  });

  it("should throw if getting invoice info fails", async () => {
    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
      ok: false,
      error: "getting invoice failed",
      desc: "invoice not found",
    });

    const blockchain = new Piixpay({
      key: "xxx",
    });

    await expect(blockchain.getInvoice("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")).rejects.toMatchSnapshot();
  });

  it("should throw if server returns error", async () => {
    mockServer.onGet(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");

    const blockchain = new Piixpay({
      key: "xxx",
    });

    await expect(blockchain.getInvoice("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")).rejects.toMatchSnapshot();
  });

  it("should accept query parameters for get", async () => {
    mockServer.onGet(/example/).reply(async config => [
      HttpStatus.OK,
      {
        config,
        ok: true,
      },
    ]);

    const blockchain = new Piixpay({
      key: "xxx",
    });

    // tslint:disable-next-line:no-any
    const response = await blockchain.get<any>("http://example.com", { foo: "bar" });

    expect(response.config.url).toEqual("http://example.com?foo=bar");
    expect(response).toMatchSnapshot();
  });

  it("should accept query parameters for post", async () => {
    mockServer.onPost(/example/).reply(async config => [
      HttpStatus.OK,
      {
        config,
        ok: true,
      },
    ]);

    const blockchain = new Piixpay({
      key: "xxx",
    });

    // tslint:disable-next-line:no-any
    const response = await blockchain.post<any>("http://example.com", { foo: "bar" }, { bar: "foo" });

    expect(response.config.url).toEqual("http://example.com?bar=foo");
    expect(response).toMatchSnapshot();
  });

  it("should accept custom logger", async () => {
    mockServer.onGet(/rate/).reply(HttpStatus.OK, {
      ok: true,
      coins: {
        BTC: {
          coin: "BTC",
          name: "Bitcoin",
          rate_eur: 7323.08,
          rate_utctime: "2018-05-15 14:00:02",
          rate_utime: 1526392802,
        },
        LTC: {
          coin: "LTC",
          name: "Litecoin",
          rate_eur: 121.8,
          rate_utctime: "2018-05-15 14:00:03",
          rate_utime: 1526392803,
        },
        BCH: {
          coin: "BCH",
          name: "Bitcoin Cash",
          rate_eur: 1180.2,
          rate_utctime: "2018-05-15 14:00:04",
          rate_utime: 1526392804,
        },
        DASH: {
          coin: "DASH",
          name: "Dash",
          rate_eur: 368.43,
          rate_utctime: "2018-05-15 14:00:05",
          rate_utime: 1526392805,
        },
      },
    });

    const mockLogger: ILogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const blockchain = new Piixpay(
      {
        key: "xxx",
      },
      mockLogger,
    );

    await blockchain.getRates();

    // tslint:disable-next-line:no-any
    expect((mockLogger.debug as any).mock.calls[0][0].response).toMatchSnapshot();
  });
});
