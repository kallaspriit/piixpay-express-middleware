"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var axios_1 = require("axios");
var querystring = require("querystring");
var ts_log_1 = require("ts-log");
/**
 * Supported request methods.
 */
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
/**
 * Supported coin symbols.
 */
var Coin;
(function (Coin) {
    Coin["BTC"] = "BTC";
    Coin["LTC"] = "LTC";
    Coin["BCH"] = "BCH";
    Coin["DASH"] = "DASH";
})(Coin = exports.Coin || (exports.Coin = {}));
/**
 * Supported coin symbols.
 */
var Language;
(function (Language) {
    Language["EN"] = "en";
    Language["ET"] = "et";
    Language["RU"] = "ru";
    Language["FI"] = "fi";
    Language["DE"] = "de";
    Language["FR"] = "fr";
})(Language = exports.Language || (exports.Language = {}));
/**
 * Enumeration of possible invoice statuses.
 */
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["NEW"] = "N";
    InvoiceStatus["UNCONFIRMED_INCOMING"] = "U";
    InvoiceStatus["INCOMPLETE"] = "I";
    InvoiceStatus["FULL_WITH_EXCEPTION"] = "E";
    InvoiceStatus["FULL"] = "F";
    InvoiceStatus["FULL_WITH_GREATER_AMOUNT"] = "G";
    InvoiceStatus["PREPARED_FOR_BANK"] = "P";
    InvoiceStatus["SENT_TO_BANK"] = "S";
    InvoiceStatus["CONFIRMED_BY_BANK"] = "C";
    InvoiceStatus["REPAYMENT_INITIATED"] = "R";
    InvoiceStatus["CANCELLED"] = "X";
    InvoiceStatus["ARCHIVED"] = "Z";
})(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
/**
 * Provides API for receiving payments through piixpay.com service.
 *
 * See https://piixpay.com/apidoc/index.html for API documentation.
 */
var Piixpay = /** @class */ (function () {
    /**
     * Constructor.
     *
     * Accepts configuration and optional logger to use.
     *
     * @param userConfig User configuration (can override base configuration as well)
     * @param log Logger to use (defaults to console, but you can use bunyan etc)
     */
    function Piixpay(userConfig, log) {
        if (log === void 0) { log = ts_log_1.dummyLogger; }
        this.log = log;
        this.config = __assign({ baseUrl: "https://applib.net/piix/api" }, userConfig);
        log.info({
            config: this.config,
        }, "created piixpay api");
    }
    /**
     * Returns status enumeration key name by value.
     *
     * @param statusValue Status enumeration value
     */
    Piixpay.getStatusByValue = function (statusValue) {
        var keys = Object.keys(InvoiceStatus);
        return keys.find(function (statusKey) { return InvoiceStatus[statusKey] === statusValue; });
    };
    /**
     * Returns rates.
     */
    Piixpay.prototype.getRates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("/merc/" + this.config.key + "/rate")];
            });
        });
    };
    /**
     * Creates a new invoice.
     *
     * @param info Invoice info
     */
    Piixpay.prototype.createInvoice = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get("/merc/" + this.config.key + "/invoice/add", __assign({}, info))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Creating invoice failed (" + response.error + " - " + response.desc + ")");
                        }
                        return [2 /*return*/, response.invoice];
                }
            });
        });
    };
    /**
     * Returns invoice info by transaction key.
     *
     * @param transactionKey Transaction key
     */
    Piixpay.prototype.getInvoice = function (transactionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get("/merc/" + this.config.key + "/invoice/" + transactionKey)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Getting invoice info failed (" + response.error + " - " + response.desc + ")");
                        }
                        return [2 /*return*/, response.invoice];
                }
            });
        });
    };
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
    Piixpay.prototype.request = function (url, method, data, options) {
        if (method === void 0) { method = RequestMethod.GET; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var startTime, response, timeTaken, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startTime = Date.now();
                        return [4 /*yield*/, axios_1.default.request(__assign({ baseURL: this.config.baseUrl, method: method,
                                url: url,
                                data: data }, options))];
                    case 1:
                        response = _a.sent();
                        timeTaken = Date.now() - startTime;
                        this.log.debug({
                            url: url,
                            method: method,
                            status: response.status,
                            statusText: response.statusText,
                            data: data,
                            response: response.data,
                            timeTaken: timeTaken,
                        }, "request completed");
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        // log failure and rethrow the error
                        this.log.error({
                            message: error_1.message,
                            status: error_1.response.status,
                            statusText: error_1.response.statusText,
                            url: url,
                            data: error_1.response.data,
                        }, "request failed");
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Makes a GET request.
     *
     * @param url URL to fetch
     * @param queryParameters Optional URL query string parameters
     */
    Piixpay.prototype.get = function (url, queryParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl;
            return __generator(this, function (_a) {
                requestUrl = "" + url + (queryParameters !== undefined ? "?" + querystring.stringify(queryParameters) : "");
                return [2 /*return*/, this.request(requestUrl, RequestMethod.GET)];
            });
        });
    };
    /**
     * Makes a POST request.
     *
     * @param url URL to post to
     * @param data Optional payload data
     * @param queryParameters Optional URL query string parameters
     */
    Piixpay.prototype.post = function (url, data, queryParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl;
            return __generator(this, function (_a) {
                requestUrl = "" + url + (queryParameters !== undefined ? "?" + querystring.stringify(queryParameters) : "");
                return [2 /*return*/, this.request(requestUrl, RequestMethod.POST, data, {
                        headers: { "content-type": "application/x-www-form-urlencoded" },
                        data: querystring.stringify(data),
                    })];
            });
        });
    };
    return Piixpay;
}());
exports.default = Piixpay;
//# sourceMappingURL=Piixpay.js.map