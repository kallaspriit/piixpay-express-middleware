/// <reference types="express" />
import * as express from "express";
import { ILogger } from "ts-log";
import { Invoice, Piixpay } from "./index";
export interface IQrCodeParameters {
    payload: string;
}
export interface IHandlePaymentUpdateRequest {
    transaction_key?: string;
}
export interface IOptions {
    api: Piixpay;
    log?: ILogger;
    saveInvoice(invoice: Invoice): Promise<void>;
}
declare const _default: (options: IOptions) => express.Router;
export default _default;
