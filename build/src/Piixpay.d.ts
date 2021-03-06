import { AxiosRequestConfig } from "axios";
import { ILogger } from "ts-log";
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
export declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
}
/**
 * Supported coin symbols.
 */
export declare enum Coin {
    BTC = "BTC",
    LTC = "LTC",
    BCH = "BCH",
    DASH = "DASH",
}
/**
 * Supported coin symbols.
 */
export declare enum Language {
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
export declare enum PiixpayInvoiceStatus {
    N = "N",
    U = "U",
    I = "I",
    E = "E",
    F = "F",
    G = "G",
    P = "P",
    S = "S",
    C = "C",
    R = "R",
    X = "X",
    Z = "Z",
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
export declare type IRatesMap = {
    [key in Coin]: IRate;
};
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
    sum_eur: number;
    description: string;
    payer_name: string;
    payer_document: string;
    contact_email: string;
    receiver_name?: string;
    receiver_address?: string;
    receiver_iban?: string;
    coin?: Coin;
    reference?: string;
    contact_phone?: string;
    contact_language?: string;
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
    private readonly log;
    private readonly config;
    /**
     * Constructor.
     *
     * Accepts configuration and optional logger to use.
     *
     * @param userConfig User configuration (can override base configuration as well)
     * @param log Logger to use (defaults to console, but you can use bunyan etc)
     */
    constructor(userConfig: IPiixpayConfig, log?: ILogger);
    /**
     * Returns rates.
     */
    getRates(): Promise<IRatesResponse>;
    /**
     * Creates a new invoice.
     *
     * @param info Invoice info
     */
    createInvoice(info: ICreateInvoiceRequest): Promise<Invoice>;
    /**
     * Returns invoice info by transaction key.
     *
     * @param transactionKey Transaction key
     */
    getInvoice(transactionKey: string): Promise<Invoice>;
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
    request<T>(url: string, method: RequestMethod, data?: object, options?: AxiosRequestConfig): Promise<T>;
    /**
     * Makes a GET request.
     *
     * @param url URL to fetch
     * @param queryParameters Optional URL query string parameters
     */
    get<T>(url: string, queryParameters?: object): Promise<T>;
    /**
     * Makes a POST request.
     *
     * @param url URL to post to
     * @param data Optional payload data
     * @param queryParameters Optional URL query string parameters
     */
    post<T>(url: string, data?: object, queryParameters?: object): Promise<T>;
}
