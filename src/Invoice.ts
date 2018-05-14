import { Coin, IInvoiceInfo, PiixpayInvoiceStatus } from "./index";

/**
 * Enumeration of possible invoice statuses.
 *
 * The single-letter Piixpay API statuses are hard to follow so a mapping to this enumeration is provided.
 */
export enum InvoicePaymentStatus {
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
export enum InvoiceAmountStatus {
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
 * Represents an invoice.
 */
export default class Invoice {
  /**
   * Constructs the invoice.
   *
   * Accepts either the parameters required to create a new invoice or serialized invoice info.
   *
   * @param info Invoice constructor info or serialized invoice info
   */
  public constructor(private readonly info: IInvoiceInfo) {}

  // public startMonitor(api: Piixpay) {}

  /**
   * Transaction key getter.
   */
  public get transactionKey() {
    return this.info.transaction_key;
  }

  /**
   * Complete status getter.
   *
   * Complete invoices to not get any more updates.
   */
  public get isComplete(): boolean {
    const completeStates: InvoicePaymentStatus[] = [InvoicePaymentStatus.FULL, InvoicePaymentStatus.ARCHIVED];

    return completeStates.indexOf(this.paymentStatus) !== -1;
  }

  /**
   * Receiver info getter.
   */
  public get receiver(): IReceiverInfo {
    return {
      name: this.info.receiver_name,
      iban: this.info.receiver_iban,
      address: this.info.receiver_address,
    };
  }

  /**
   * Invoice payment status getter.
   *
   * The internal API single-letter status is mapped to InvoicePaymentStatus enumeration.
   */
  public get paymentStatus(): InvoicePaymentStatus {
    const statusMapping = {
      [PiixpayInvoiceStatus.N]: InvoicePaymentStatus.NEW,
      [PiixpayInvoiceStatus.U]: InvoicePaymentStatus.UNCONFIRMED_INCOMING,
      [PiixpayInvoiceStatus.I]: InvoicePaymentStatus.INCOMPLETE,
      [PiixpayInvoiceStatus.E]: InvoicePaymentStatus.FULL_WITH_EXCEPTION,
      [PiixpayInvoiceStatus.F]: InvoicePaymentStatus.FULL,
      [PiixpayInvoiceStatus.G]: InvoicePaymentStatus.FULL_WITH_GREATER_AMOUNT,
      [PiixpayInvoiceStatus.P]: InvoicePaymentStatus.PREPARED_FOR_BANK,
      [PiixpayInvoiceStatus.S]: InvoicePaymentStatus.SENT_TO_BANK,
      [PiixpayInvoiceStatus.C]: InvoicePaymentStatus.CONFIRMED_BY_BANK,
      [PiixpayInvoiceStatus.R]: InvoicePaymentStatus.REPAYMENT_INITIATED,
      [PiixpayInvoiceStatus.N]: InvoicePaymentStatus.NEW,
      [PiixpayInvoiceStatus.X]: InvoicePaymentStatus.CANCELLED,
      [PiixpayInvoiceStatus.Z]: InvoicePaymentStatus.ARCHIVED,
    };

    return statusMapping[this.info.status];
  }

  /**
   * Payment amount status getter.
   *
   * The invoice might be under or overpaid.
   */
  public get amountStatus(): InvoiceAmountStatus {
    const paidAmount = this.info.received_coin;
    const dueAmount = this.info.total_coin;

    if (paidAmount > dueAmount) {
      return InvoiceAmountStatus.OVERPAID;
    } else if (paidAmount < dueAmount) {
      return InvoiceAmountStatus.UNDERPAID;
    }

    return InvoiceAmountStatus.EXACT;
  }

  /**
   * Coin symbol getter.
   */
  public get coin(): Coin {
    return this.info.coin;
  }

  /**
   * Description getter.
   */
  public get description() {
    return this.info.description;
  }

  /**
   * Invoice amount getter.
   */
  public get amount() {
    return {
      eur: this.info.sum_eur,
      coin: this.info.sum_eur / this.rate,
    };
  }

  /**
   * Fee amounts getter.
   */
  public get fees() {
    return {
      service: {
        eur: this.info.fees_eur,
        coin: this.info.fees_coin,
      },
      bank: {
        eur: this.info.bank_fees_eur,
        coin: this.info.bank_fees_coin,
      },
      total: {
        eur: this.info.fees_eur + this.info.bank_fees_eur,
        coin: this.info.fees_coin + this.info.bank_fees_coin,
      },
    };
  }

  /**
   * Due amounts getter.
   */
  public get due() {
    return {
      eur: this.info.sum_eur + this.fees.total.eur,
      coin: this.info.total_coin,
    };
  }

  /**
   * Received amounts getter.
   */
  public get received() {
    return {
      eur: this.info.received_coin * this.rate,
      coin: this.info.received_coin,
    };
  }

  /**
   * Rate getter.
   */
  public get rate() {
    return this.info.rate;
  }

  /**
   * Payment url getter.
   */
  public get paymentUrl() {
    return this.info.payment_url;
  }

  /**
   * Serializes the invoice.
   */
  public toJSON() {
    return {
      transactionKey: this.transactionKey,
      isComplete: this.isComplete,
      receiver: this.receiver,
      paymentStatus: this.paymentStatus,
      amountStatus: this.amountStatus,
      coin: this.coin,
      description: this.description,
      amount: this.amount,
      fees: this.fees,
      due: this.due,
      received: this.received,
      rate: this.rate,
      paymentUrl: this.paymentUrl,
      info: this.info,
    };
  }
}
