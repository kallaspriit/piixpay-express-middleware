"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
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
        /**
         * Latest polling timer.
         */
        // tslint:disable-next-line:no-null-keyword
        this.pollTimeout = null;
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
    Object.defineProperty(Invoice.prototype, "createdDate", {
        /**
         * Created date getter.
         */
        get: function () {
            return new Date(this.info.created_time);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "updatedDate", {
        /**
         * Updated date getter.
         */
        get: function () {
            return new Date(this.info.status_time);
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
    Object.defineProperty(Invoice.prototype, "paymentUrl", {
        /**
         * Payment url getter.
         */
        get: function () {
            return this.info.payment_url;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Starts the automatic new info poller.
     *
     * TODO: remove once callback logic gets implemented instead
     *
     * @param api Api to use
     * @param callback Callback to call with new invoice info
     */
    Invoice.prototype.startPolling = function (api, callback) {
        // const timeSinceCreated = Date.now() - this.createdDate.getTime();
        // const pollIntervalMap = {
        //   [30 * 60 * 1000]: 15 * 1000,
        //   [3 * 60 * 60 * 1000]: 5 * 60 * 1000,
        // };
        var _this = this;
        // console.log("timeSinceCreated", timeSinceCreated);
        var pollInterval = 10000; // TODO: based on age
        this.pollTimeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var invoice, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.getInvoice(this.transactionKey)];
                    case 1:
                        invoice = _a.sent();
                        // tslint:disable-next-line:no-null-keyword
                        callback(null, invoice);
                        // schedule another poll
                        this.startPolling(api, callback);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        callback(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, pollInterval);
    };
    /**
     * Ends polling if running.
     */
    Invoice.prototype.endPolling = function () {
        if (this.pollTimeout === null) {
            return;
        }
        clearTimeout(this.pollTimeout);
        // tslint:disable-next-line:no-null-keyword
        this.pollTimeout = null;
    };
    /**
     * Returns whether current invoice has the same contents as the provided invoice.
     *
     * @param anotherInvoice Another invoice to compare to
     */
    Invoice.prototype.isSameAs = function (anotherInvoice) {
        return lodash_1.isEqual(this.toJSON(), anotherInvoice.toJSON());
    };
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
            paymentUrl: this.paymentUrl,
            info: this.info,
        };
    };
    return Invoice;
}());
exports.default = Invoice;
//# sourceMappingURL=Invoice.js.map