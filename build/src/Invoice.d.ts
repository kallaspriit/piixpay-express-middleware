import { Coin, IInvoiceInfo } from "./index";
/**
 * Enumeration of possible invoice statuses.
 *
 * The single-letter Piixpay API statuses are hard to follow so a mapping to this enumeration is provided.
 */
export declare enum InvoicePaymentStatus {
    NEW = "NEW",
    UNCONFIRMED_INCOMING = "UNCONFIRMED_INCOMING",
    INCOMPLETE = "INCOMPLETE",
    FULL_WITH_EXCEPTION = "FULL_WITH_EXCEPTION",
    FULL = "FULL",
    FULL_WITH_GREATER_AMOUNT = "FULL_WITH_GREATER_AMOUNT",
    PREPARED_FOR_BANK = "PREPARED_FOR_BANK",
    SENT_TO_BANK = "SENT_TO_BANK",
    CONFIRMED_BY_BANK = "CONFIRMED_BY_BANK",
    REPAYMENT_INITIATED = "REPAYMENT_INITIATED",
    CANCELLED = "CANCELLED",
    ARCHIVED = "ARCHIVED",
}
/**
 * Invoice amount state enumeration.
 */
export declare enum InvoiceAmountStatus {
    EXACT = "EXACT",
    OVERPAID = "OVERPAID",
    UNDERPAID = "UNDERPAID",
}
/**
 * Receiver info.
 */
export interface IReceiverInfo {
    name: string;
    iban: string;
    address: string | null;
}
/**
 * Invoice update callback.
 */
export declare type InvoiceUpdateCallback = (error: Error | null, info?: Invoice) => void;
/**
 * Represents an invoice.
 */
export default class Invoice {
    private readonly info;
    /**
     * Constructs the invoice.
     *
     * Accepts either the parameters required to create a new invoice or serialized invoice info.
     *
     * @param info Invoice constructor info or serialized invoice info
     */
    constructor(info: IInvoiceInfo);
    /**
     * Transaction key getter.
     */
    readonly transactionKey: string;
    /**
     * Complete status getter.
     *
     * Complete invoices to not get any more updates.
     */
    readonly isComplete: boolean;
    /**
     * Receiver info getter.
     */
    readonly receiver: IReceiverInfo;
    /**
     * Invoice payment status getter.
     *
     * The internal API single-letter status is mapped to InvoicePaymentStatus enumeration.
     */
    readonly paymentStatus: InvoicePaymentStatus;
    /**
     * Payment amount status getter.
     *
     * The invoice might be under or overpaid.
     */
    readonly amountStatus: InvoiceAmountStatus;
    /**
     * Created date getter.
     */
    readonly createdDate: Date;
    /**
     * Updated date getter.
     */
    readonly updatedDate: Date;
    /**
     * Coin symbol getter.
     */
    readonly coin: Coin;
    /**
     * Description getter.
     */
    readonly description: string;
    /**
     * Invoice amount getter.
     */
    readonly amount: {
        eur: number;
        coin: number;
    };
    /**
     * Fee amounts getter.
     */
    readonly fees: {
        service: {
            eur: number;
            coin: number;
        };
        bank: {
            eur: number;
            coin: number;
        };
        total: {
            eur: number;
            coin: number;
        };
    };
    /**
     * Due amounts getter.
     */
    readonly due: {
        eur: number;
        coin: number;
    };
    /**
     * Received amounts getter.
     */
    readonly received: {
        eur: number;
        coin: number;
    };
    /**
     * Rate getter.
     */
    readonly rate: number;
    /**
     * Payment url getter.
     */
    readonly paymentUrl: string;
    /**
     * Serializes the invoice.
     */
    toJSON(): {
        transactionKey: string;
        isComplete: boolean;
        receiver: IReceiverInfo;
        paymentStatus: InvoicePaymentStatus;
        amountStatus: InvoiceAmountStatus;
        coin: Coin;
        description: string;
        amount: {
            eur: number;
            coin: number;
        };
        fees: {
            service: {
                eur: number;
                coin: number;
            };
            bank: {
                eur: number;
                coin: number;
            };
            total: {
                eur: number;
                coin: number;
            };
        };
        due: {
            eur: number;
            coin: number;
        };
        received: {
            eur: number;
            coin: number;
        };
        rate: number;
        paymentUrl: string;
        info: IInvoiceInfo;
    };
}
