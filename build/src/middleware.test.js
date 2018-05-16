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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_mock_adapter_1 = require("axios-mock-adapter");
var bodyParser = require("body-parser");
var express = require("express");
var HttpStatus = require("http-status-codes");
var querystring = require("querystring");
var supertest = require("supertest");
var _1 = require("./");
// invoices "database" emulated with a simple array
var invoiceDatabase = [];
var server;
var mockServer;
describe("middleware", function () {
    beforeEach(function () {
        // create axios mock server
        mockServer = new axios_mock_adapter_1.default(axios_1.default);
        // create app
        var app = express();
        // parse application/x-www-form-urlencoded and  application/json
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        // use the blockchain middleware
        app.use("/payment", _1.default({
            api: new _1.Piixpay({
                key: "xxx",
            }),
            saveInvoice: saveInvoice,
        }));
        server = supertest(app);
    });
    afterEach(function () {
        // remove the mock server
        mockServer.restore();
        // "clear" the database
        while (invoiceDatabase.length > 0) {
            invoiceDatabase.pop();
        }
    });
    it("should provide qr code rendering", function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.get("/payment/qr?" + querystring.stringify({
                        payload: "bitcoin:bmitnJQ1OqzZzOGv6abovJxdO1PuSnqn?amount=0.00450000",
                    }))];
                case 1:
                    response = _a.sent();
                    expect(response.type).toEqual("image/png");
                    expect(response.body).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should accept custom logger", function () { return __awaiter(_this, void 0, void 0, function () {
        var mockLogger;
        return __generator(this, function (_a) {
            mockLogger = {
                trace: jest.fn(),
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
            };
            _1.default({
                api: new _1.Piixpay({
                    key: "xxx",
                }),
                saveInvoice: saveInvoice,
                log: mockLogger,
            });
            return [2 /*return*/];
        });
    }); });
    it("should handle valid payment updates", function () { return __awaiter(_this, void 0, void 0, function () {
        var invoice, response, updatedInvoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invoice = new _1.Invoice(getMockInvoiceInfo());
                    invoiceDatabase.push(invoice);
                    // mock get invoice response
                    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
                        ok: true,
                        invoice: getMockInvoiceInfo({
                            status: _1.PiixpayInvoiceStatus.F,
                            received_coin: invoice.due.coin,
                        }),
                    });
                    return [4 /*yield*/, server.post("/payment/handle-payment").send({
                            transaction_key: invoice.transactionKey,
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.OK);
                    expect(response.text).toMatchSnapshot();
                    updatedInvoice = invoiceDatabase[0];
                    expect(updatedInvoice.isPaid).toBe(true);
                    expect(updatedInvoice.isComplete).toBe(true);
                    expect(updatedInvoice.paymentStatus).toBe(_1.InvoicePaymentStatus.FULL);
                    expect(updatedInvoice.amountStatus).toBe(_1.InvoiceAmountStatus.EXACT);
                    expect(processInvoicesDatabaseForSnapshot(invoiceDatabase)).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle underpayment", function () { return __awaiter(_this, void 0, void 0, function () {
        var invoice, response, updatedInvoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invoice = new _1.Invoice(getMockInvoiceInfo());
                    invoiceDatabase.push(invoice);
                    // mock get invoice response
                    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
                        ok: true,
                        invoice: getMockInvoiceInfo({
                            status: _1.PiixpayInvoiceStatus.F,
                            received_coin: invoice.due.coin * 0.5,
                        }),
                    });
                    return [4 /*yield*/, server.post("/payment/handle-payment").send({
                            transaction_key: invoice.transactionKey,
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.OK);
                    expect(response.text).toMatchSnapshot();
                    updatedInvoice = invoiceDatabase[0];
                    expect(updatedInvoice.isPaid).toBe(true);
                    expect(updatedInvoice.isComplete).toBe(true);
                    expect(updatedInvoice.paymentStatus).toBe(_1.InvoicePaymentStatus.FULL);
                    expect(updatedInvoice.amountStatus).toBe(_1.InvoiceAmountStatus.UNDERPAID);
                    expect(processInvoicesDatabaseForSnapshot(invoiceDatabase)).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle overpayment", function () { return __awaiter(_this, void 0, void 0, function () {
        var invoice, response, updatedInvoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invoice = new _1.Invoice(getMockInvoiceInfo());
                    invoiceDatabase.push(invoice);
                    // mock get invoice response
                    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
                        ok: true,
                        invoice: getMockInvoiceInfo({
                            status: _1.PiixpayInvoiceStatus.F,
                            received_coin: invoice.due.coin * 2,
                        }),
                    });
                    return [4 /*yield*/, server.post("/payment/handle-payment").send({
                            transaction_key: invoice.transactionKey,
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.OK);
                    expect(response.text).toMatchSnapshot();
                    updatedInvoice = invoiceDatabase[0];
                    expect(updatedInvoice.isPaid).toBe(true);
                    expect(updatedInvoice.isComplete).toBe(true);
                    expect(updatedInvoice.paymentStatus).toBe(_1.InvoicePaymentStatus.FULL);
                    expect(updatedInvoice.amountStatus).toBe(_1.InvoiceAmountStatus.OVERPAID);
                    expect(processInvoicesDatabaseForSnapshot(invoiceDatabase)).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return bad request if the transaction key is missing", function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.post("/payment/handle-payment").send({
                    // no transaction key
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
                    expect(response.text).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return bad request if the transaction key does not have correct format", function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.post("/payment/handle-payment").send({
                        transaction_key: "xxx",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
                    expect(response.text).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return not found if the invoice could not be found", function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.post("/payment/handle-payment").send({
                        transaction_key: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
                    expect(response.text).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return internal error if the remote api fails, includes error data if a string is provided", function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR, "remote error message");
                    return [4 /*yield*/, server.post("/payment/handle-payment").send({
                            transaction_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
                    expect(response.text).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return internal error if the remote api fails, uses error if no data is provided", function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR);
                    return [4 /*yield*/, server.post("/payment/handle-payment").send({
                            transaction_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
                    expect(response.text).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
function saveInvoice(invoice) {
    return __awaiter(this, void 0, void 0, function () {
        var existingInvoiceIndex;
        return __generator(this, function (_a) {
            existingInvoiceIndex = invoiceDatabase.findIndex(function (item) { return item.transactionKey === invoice.transactionKey; });
            if (existingInvoiceIndex !== -1) {
                invoiceDatabase[existingInvoiceIndex] = invoice;
            }
            else {
                invoiceDatabase.push(invoice);
            }
            return [2 /*return*/];
        });
    });
}
function getMockInvoiceInfo(override) {
    if (override === void 0) { override = {}; }
    return __assign({ transaction_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", status: _1.PiixpayInvoiceStatus.N, status_time: "2018-05-15 15:51:05 +00:00", status_utime: 1526399465, created_time: "2018-05-15 14:10:26 +00:00", created_utime: 1526393426, receiver_name: "Dag University", receiver_address: null, receiver_iban: "DA12345EFAEJBF242424524", coin: _1.Coin.BTC, sum_eur: 5, total_eur: 30.05, total_btc: 0.0043, fees_eur: 0.05, fees_btc: 0.0001, bank_fees_eur: 25, bank_fees_btc: 0.0035, received_btc: 0, missing_btc: 0.0043, rate: 7325.43, bitcoin_address: "iURIGqIuMNu2W2H89jOqqXmbu3RmdBz5", description: "Test payment", reference: null, contact_email: "test@example.com", contact_phone: null, contact_language: "", payer_name: "John Rambo", payer_document: "019ae981-713f-4eb8-860f-c11d48f29a1c", due_date: null, qrc_image_url: "https://www.piix.eu/web/qr/wvmvw317lls3j9wag68sntztw2wvnauw/code.jpg", qrc_endpoint_url: "http://www.piix.eu/web/qr/wvmvw317lls3j9wag68sntztw2wvnauw/redirect/", payment_url: "bitcoin://iURIGqIuMNu2W2H89jOqqXmbu3RmdBz5?amount=0.00430000", total_coin: 0.0043, fees_coin: 0.0001, bank_fees_coin: 0.0035, received_coin: 0, missing_coin: 0.0043, coin_address: "iURIGqIuMNu2W2H89jOqqXmbu3RmdBz5" }, override);
}
exports.getMockInvoiceInfo = getMockInvoiceInfo;
function processInvoiceForSnapshot(invoice) {
    invoice.info.created_time = new Date(0).toISOString();
    invoice.info.status_time = new Date(0).toISOString();
    return invoice;
}
exports.processInvoiceForSnapshot = processInvoiceForSnapshot;
function processInvoicesDatabaseForSnapshot(invoices) {
    invoices.forEach(processInvoiceForSnapshot);
    return invoices;
}
exports.processInvoicesDatabaseForSnapshot = processInvoicesDatabaseForSnapshot;
//# sourceMappingURL=middleware.test.js.map