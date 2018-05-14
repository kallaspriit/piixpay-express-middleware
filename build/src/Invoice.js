"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
/**
 * Enumeration of possible invoice statuses.
 *
 * The single-letter Piixpay API statuses are hard to follow so a mapping to this enumeration is provided.
 */
var InvoicePaymentStatus;
(function (InvoicePaymentStatus) {
    InvoicePaymentStatus["NEW"] = "NEW";
    InvoicePaymentStatus["UNCONFIRMED_INCOMING"] = "UNCONFIRMED_INCOMING";
    InvoicePaymentStatus["INCOMPLETE"] = "INCOMPLETE";
    InvoicePaymentStatus["FULL_WITH_EXCEPTION"] = "FULL_WITH_EXCEPTION";
    InvoicePaymentStatus["FULL"] = "FULL";
    InvoicePaymentStatus["FULL_WITH_GREATER_AMOUNT"] = "FULL_WITH_GREATER_AMOUNT";
    InvoicePaymentStatus["PREPARED_FOR_BANK"] = "PREPARED_FOR_BANK";
    InvoicePaymentStatus["SENT_TO_BANK"] = "SENT_TO_BANK";
    InvoicePaymentStatus["CONFIRMED_BY_BANK"] = "CONFIRMED_BY_BANK";
    InvoicePaymentStatus["REPAYMENT_INITIATED"] = "REPAYMENT_INITIATED";
    InvoicePaymentStatus["CANCELLED"] = "CANCELLED";
    InvoicePaymentStatus["ARCHIVED"] = "ARCHIVED";
})(InvoicePaymentStatus = exports.InvoicePaymentStatus || (exports.InvoicePaymentStatus = {}));
/**
 * Invoice amount state enumeration.
 */
var InvoiceAmountStatus;
(function (InvoiceAmountStatus) {
    InvoiceAmountStatus["EXACT"] = "EXACT";
    InvoiceAmountStatus["OVERPAID"] = "OVERPAID";
    InvoiceAmountStatus["UNDERPAID"] = "UNDERPAID";
})(InvoiceAmountStatus = exports.InvoiceAmountStatus || (exports.InvoiceAmountStatus = {}));
/**
 * Represents an invoice.
 */
var Invoice = /** @class */ (function () {
    /**
     * Constructs the invoice.
     *
     * Accepts either the parameters required to create a new invoice or serialized invoice info.
     *
     * @param info Invoice constructor info or serialized invoice info
     */
    function Invoice(info) {
        this.info = info;
    }
    Object.defineProperty(Invoice.prototype, "transactionKey", {
        // public startMonitor(api: Piixpay) {}
        /**
         * Transaction key getter.
         */
        get: function () {
            return this.info.transaction_key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "isComplete", {
        /**
         * Complete status getter.
         *
         * Complete invoices to not get any more updates.
         */
        get: function () {
            var completeStates = [InvoicePaymentStatus.FULL, InvoicePaymentStatus.ARCHIVED];
            return completeStates.indexOf(this.paymentStatus) !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "receiver", {
        /**
         * Receiver info getter.
         */
        get: function () {
            return {
                name: this.info.receiver_name,
                iban: this.info.receiver_iban,
                address: this.info.receiver_address,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "paymentStatus", {
        /**
         * Invoice payment status getter.
         *
         * The internal API single-letter status is mapped to InvoicePaymentStatus enumeration.
         */
        get: function () {
            var statusMapping = (_a = {},
                _a[index_1.PiixpayInvoiceStatus.N] = InvoicePaymentStatus.NEW,
                _a[index_1.PiixpayInvoiceStatus.U] = InvoicePaymentStatus.UNCONFIRMED_INCOMING,
                _a[index_1.PiixpayInvoiceStatus.I] = InvoicePaymentStatus.INCOMPLETE,
                _a[index_1.PiixpayInvoiceStatus.E] = InvoicePaymentStatus.FULL_WITH_EXCEPTION,
                _a[index_1.PiixpayInvoiceStatus.F] = InvoicePaymentStatus.FULL,
                _a[index_1.PiixpayInvoiceStatus.G] = InvoicePaymentStatus.FULL_WITH_GREATER_AMOUNT,
                _a[index_1.PiixpayInvoiceStatus.P] = InvoicePaymentStatus.PREPARED_FOR_BANK,
                _a[index_1.PiixpayInvoiceStatus.S] = InvoicePaymentStatus.SENT_TO_BANK,
                _a[index_1.PiixpayInvoiceStatus.C] = InvoicePaymentStatus.CONFIRMED_BY_BANK,
                _a[index_1.PiixpayInvoiceStatus.R] = InvoicePaymentStatus.REPAYMENT_INITIATED,
                _a[index_1.PiixpayInvoiceStatus.N] = InvoicePaymentStatus.NEW,
                _a[index_1.PiixpayInvoiceStatus.X] = InvoicePaymentStatus.CANCELLED,
                _a[index_1.PiixpayInvoiceStatus.Z] = InvoicePaymentStatus.ARCHIVED,
                _a);
            return statusMapping[this.info.status];
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "amountStatus", {
        /**
         * Payment amount status getter.
         *
         * The invoice might be under or overpaid.
         */
        get: function () {
            var paidAmount = this.info.received_coin;
            var dueAmount = this.info.total_coin;
            if (paidAmount > dueAmount) {
                return InvoiceAmountStatus.OVERPAID;
            }
            else if (paidAmount < dueAmount) {
                return InvoiceAmountStatus.UNDERPAID;
            }
            return InvoiceAmountStatus.EXACT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "coin", {
        /**
         * Coin symbol getter.
         */
        get: function () {
            return this.info.coin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "description", {
        /**
         * Description getter.
         */
        get: function () {
            return this.info.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "amount", {
        /**
         * Invoice amount getter.
         */
        get: function () {
            return {
                eur: this.info.sum_eur,
                coin: this.info.sum_eur / this.rate,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "fees", {
        /**
         * Fee amounts getter.
         */
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "due", {
        /**
         * Due amounts getter.
         */
        get: function () {
            return {
                eur: this.info.sum_eur + this.fees.total.eur,
                coin: this.info.total_coin,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "received", {
        /**
         * Received amounts getter.
         */
        get: function () {
            return {
                eur: this.info.received_coin * this.rate,
                coin: this.info.received_coin,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "rate", {
        /**
         * Rate getter.
         */
        get: function () {
            return this.info.rate;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Serializes the invoice.
     */
    Invoice.prototype.toJSON = function () {
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
            info: this.info,
        };
    };
    return Invoice;
}());
exports.default = Invoice;
//# sourceMappingURL=Invoice.js.map