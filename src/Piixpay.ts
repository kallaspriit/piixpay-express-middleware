import Axios, { AxiosRequestConfig } from "axios";
import * as querystring from "querystring";
import { dummyLogger, ILogger } from "ts-log";
import { Invoice } from "./index";

/**
 * API configuration.
 */
export interface IPiixpayConfig {
  key: string;
  baseUrl?: string;
}

/**
 * Supported request methods.
 */
export enum RequestMethod {
  GET = "GET",
  POST = "POST",
}

/**
 * Supported coin symbols.
 */
export enum Coin {
  BTC = "BTC",
  LTC = "LTC",
  BCH = "BCH",
  DASH = "DASH",
}

/**
 * Supported coin symbols.
 */
export enum Language {
  EN = "en",
  ET = "et",
  RU = "ru",
  FI = "fi",
  DE = "de",
  FR = "fr",
}

/**
 * Enumeration of possible invoice statuses.
 */
export enum PiixpayInvoiceStatus {
  N = "N", // means NEW
  U = "U", // means UNCONFIRMED_INCOMING
  I = "I", // means INCOMPLETE
  E = "E", // means FULL_WITH_EXCEPTION
  F = "F", // means FULL
  G = "G", // means FULL_WITH_GREATER_AMOUNT
  P = "P", // means PREPARED_FOR_BANK
  S = "S", // means SENT_TO_BANK
  C = "C", // means CONFIRMED_BY_BANK
  R = "R", // means REPAYMENT_INITIATED
  X = "X", // means CANCELLED
  Z = "Z", // means ARCHIVED
}

/**
 * Common response envelope info.
 */
export interface ICommonResponse {
  ok: boolean;
  error?: string;
  desc?: string;
}

/**
 * Login response data.
 */
export interface ILoginResponse extends ICommonResponse {
  session_key: string;
  session_expires_utctime: string;
  session_expires_utime: number;
  session_is_permanent: boolean;
  server_utctime: string;
  server_utime: number;
  merchant_key: string;
  merchant_name: string;
  user_first_name: string | null;
  user_family_name: string | null;
  prm: {
    pos: boolean;
    settle: boolean;
  };
}

/**
 * Represents rate info
 */
export interface IRate {
  coin: Coin;
  name: string;
  rate_eur: number;
  rate_utctime: string;
  rate_utime: number;
}

/**
 * Map of rates
 */
export type IRatesMap = { [key in Coin]: IRate };

/**
 * Rates response.
 */
export interface IRatesResponse extends ICommonResponse {
  coins: IRatesMap;
}

/**
 * Create invoice request parameters.
 */
export interface ICreateInvoiceRequest {
  receiver_name?: string;
  receiver_address?: string;
  receiver_iban?: string;
  sum_eur: number;
  coin?: Coin;
  description: string;
  reference?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_language?: string;
  payer_name?: string;
  payer_document?: string;
  due_date?: string;
}

/**
 * Represents an invoice.
 */
export interface IInvoiceInfo {
  transaction_key: string;
  status: PiixpayInvoiceStatus;
  status_time: string;
  status_utime: number;
  created_time: string;
  created_utime: number;
  receiver_name: string;
  receiver_address: string | null;
  receiver_iban: string;
  coin: Coin;
  sum_eur: number;
  total_eur: number;
  total_btc: number;
  fees_eur: number;
  fees_btc: number;
  bank_fees_eur: number;
  bank_fees_btc: number;
  received_btc: number;
  missing_btc: number;
  rate: number;
  bitcoin_address: string;
  description: string;
  reference: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_language: string;
  payer_name: string | null;
  payer_document: string | null;
  due_date: string | null;
  qrc_image_url: string;
  qrc_endpoint_url: string;
  payment_url: string;
  total_coin: number;
  fees_coin: number;
  bank_fees_coin: number;
  received_coin: number;
  missing_coin: number;
  coin_address: string;
}

/**
 * Create invoice response.
 */
export interface ICreateInvoiceResponse extends ICommonResponse {
  invoice: IInvoiceInfo;
}

/**
 * Get invoice response.
 */
export interface IGetInvoiceResponse extends ICommonResponse {
  invoice: IInvoiceInfo;
}

/**
 * Provides API for receiving payments through piixpay.com service.
 *
 * See https://piixpay.com/apidoc/index.html for API documentation.
 */
export default class Piixpay {
  private readonly config: Required<IPiixpayConfig>;

  /**
   * Constructor.
   *
   * Accepts configuration and optional logger to use.
   *
   * @param userConfig User configuration (can override base configuration as well)
   * @param log Logger to use (defaults to console, but you can use bunyan etc)
   */
  public constructor(userConfig: IPiixpayConfig, private readonly log: ILogger = dummyLogger) {
    this.config = {
      baseUrl: "https://applib.net/piix/api",
      ...userConfig,
    };
  }

  /**
   * Returns status enumeration key name by value.
   *
   * @param statusValue Status enumeration value
   */
  public static getStatusByValue(statusValue: PiixpayInvoiceStatus): keyof typeof PiixpayInvoiceStatus | undefined {
    const keys = Object.keys(PiixpayInvoiceStatus) as Array<keyof typeof PiixpayInvoiceStatus>;

    return keys.find(statusKey => PiixpayInvoiceStatus[statusKey] === statusValue);
  }

  /**
   * Returns rates.
   */
  public async getRates(): Promise<IRatesResponse> {
    return this.get<IRatesResponse>(`/merc/${this.config.key}/rate`);
  }

  /**
   * Creates a new invoice.
   *
   * @param info Invoice info
   */
  public async createInvoice(info: ICreateInvoiceRequest): Promise<Invoice> {
    const response = await this.get<ICreateInvoiceResponse>(`/merc/${this.config.key}/invoice/add`, {
      // session_key: this.sessionKey,
      ...info,
    });

    if (!response.ok) {
      throw new Error(`Creating invoice failed (${response.error} - ${response.desc})`);
    }

    return new Invoice(response.invoice);
  }

  /**
   * Returns invoice info by transaction key.
   *
   * @param transactionKey Transaction key
   */
  public async getInvoice(transactionKey: string): Promise<Invoice> {
    const response = await this.get<IGetInvoiceResponse>(`/merc/${this.config.key}/invoice/${transactionKey}`);

    if (!response.ok) {
      throw new Error(`Getting invoice info failed (${response.error} - ${response.desc})`);
    }

    return new Invoice(response.invoice);
  }

  /**
   * Makes an API request.
   *
   * Uses the base URL from the configuration.
   *
   * @param url URL to request
   * @param method Request method
   * @param data Optional payload data
   * @param options Optional axios options
   */
  public async request<T>(
    url: string,
    method = RequestMethod.GET,
    data?: object,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    // attempt to fetch rates (throws for non 2xx response)
    try {
      const startTime = Date.now();
      const response = await Axios.request<T>({
        baseURL: this.config.baseUrl,
        method,
        url,
        data,
        ...options,
      });
      const timeTaken = Date.now() - startTime;

      this.log.debug(
        {
          url,
          method,
          status: response.status,
          statusText: response.statusText,
          data,
          response: response.data,
          timeTaken,
        },
        "request completed",
      );

      return response.data;
    } catch (error) {
      // log failure and rethrow the error
      this.log.error(
        {
          message: error.message,
          status: error.response.status,
          statusText: error.response.statusText,
          url,
          data: error.response.data,
        },
        "request failed",
      );

      throw error;
    }
  }

  /**
   * Makes a GET request.
   *
   * @param url URL to fetch
   * @param queryParameters Optional URL query string parameters
   */
  public async get<T>(url: string, queryParameters?: object): Promise<T> {
    // add the query parameters if available
    const requestUrl = `${url}${queryParameters !== undefined ? `?${querystring.stringify(queryParameters)}` : ""}`;

    return this.request<T>(requestUrl, RequestMethod.GET);
  }

  /**
   * Makes a POST request.
   *
   * @param url URL to post to
   * @param data Optional payload data
   * @param queryParameters Optional URL query string parameters
   */
  public async post<T>(url: string, data?: object, queryParameters?: object): Promise<T> {
    // add the query parameters if available
    const requestUrl = `${url}${queryParameters !== undefined ? `?${querystring.stringify(queryParameters)}` : ""}`;

    return this.request<T>(requestUrl, RequestMethod.POST, data, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: querystring.stringify(data),
    });
  }
}
