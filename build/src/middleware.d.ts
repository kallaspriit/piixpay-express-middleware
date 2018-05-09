/// <reference types="express" />
import * as express from "express";
import { ILogger } from "ts-log";
import { Invoice } from "./index";
export interface IQrCodeParameters {
    address: string;
    amount: number | string;
    message: string;
}
export interface IOptions {
    log?: ILogger;
    saveInvoice(invoice: Invoice): Promise<void>;
    loadInvoice(address: string): Promise<Invoice | undefined>;
}
declare const _default: (options: IOptions) => express.Router;
export default _default;
