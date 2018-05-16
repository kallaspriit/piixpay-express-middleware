import { IInvoiceInfo, Invoice } from "./";
export declare function getMockInvoiceInfo(override?: Partial<IInvoiceInfo>): IInvoiceInfo;
export declare function processInvoiceForSnapshot(invoice: Invoice): Invoice;
export declare function processInvoicesDatabaseForSnapshot(invoices: Invoice[]): Invoice[];
