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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_mock_adapter_1 = require("axios-mock-adapter");
var HttpStatus = require("http-status-codes");
var index_1 = require("./index");
var middleware_test_1 = require("./middleware.test");
var mockServer;
describe("Blockchain", function () {
    beforeEach(function () {
        mockServer = new axios_mock_adapter_1.default(axios_1.default);
    });
    afterEach(function () {
        mockServer.restore();
    });
    it("should work", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect(true).toBe(true);
            return [2 /*return*/];
        });
    }); });
    it("should create a new invoice", function () { return __awaiter(_this, void 0, void 0, function () {
        var blockchain, invoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onPost(/invoice/).reply(HttpStatus.OK, {
                        ok: true,
                        invoice: middleware_test_1.getMockInvoiceInfo(),
                    });
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, blockchain.createInvoice({
                            sum_eur: 5,
                            description: "Test",
                            payer_name: "John Rambo",
                            payer_document: "123456",
                            contact_email: "john@rambo.com",
                        })];
                case 1:
                    invoice = _a.sent();
                    expect(middleware_test_1.processInvoiceForSnapshot(invoice)).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error if crating invoice failed", function () { return __awaiter(_this, void 0, void 0, function () {
        var blockchain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onPost(/invoice/).reply(HttpStatus.OK, {
                        ok: false,
                        error: "creating invoice failed",
                        desc: "internal error occured",
                    });
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, expect(blockchain.createInvoice({
                            sum_eur: 5,
                            description: "Test",
                            payer_name: "John Rambo",
                            payer_document: "123456",
                            contact_email: "john@rambo.com",
                        })).rejects.toMatchSnapshot()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error when creating invoice if server returns error", function () { return __awaiter(_this, void 0, void 0, function () {
        var blockchain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onPost(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, expect(blockchain.createInvoice({
                            sum_eur: 5,
                            description: "Test",
                            payer_name: "John Rambo",
                            payer_document: "123456",
                            contact_email: "john@rambo.com",
                        })).rejects.toMatchSnapshot()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return invoice info", function () { return __awaiter(_this, void 0, void 0, function () {
        var blockchain, invoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
                        ok: true,
                        invoice: middleware_test_1.getMockInvoiceInfo(),
                    });
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, blockchain.getInvoice("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")];
                case 1:
                    invoice = _a.sent();
                    expect(middleware_test_1.processInvoiceForSnapshot(invoice)).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw if getting invoice info fails", function () { return __awaiter(_this, void 0, void 0, function () {
        var blockchain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/invoice/).reply(HttpStatus.OK, {
                        ok: false,
                        error: "getting invoice failed",
                        desc: "invoice not found",
                    });
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, expect(blockchain.getInvoice("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")).rejects.toMatchSnapshot()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw if server returns error", function () { return __awaiter(_this, void 0, void 0, function () {
        var blockchain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/invoice/).reply(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, expect(blockchain.getInvoice("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")).rejects.toMatchSnapshot()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should accept query parameters for get", function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var blockchain, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/example/).reply(function (config) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [
                                    HttpStatus.OK,
                                    {
                                        config: config,
                                        ok: true,
                                    },
                                ]];
                        });
                    }); });
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, blockchain.get("http://example.com", { foo: "bar" })];
                case 1:
                    response = _a.sent();
                    expect(response.config.url).toEqual("http://example.com?foo=bar");
                    expect(response).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should accept query parameters for post", function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var blockchain, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onPost(/example/).reply(function (config) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [
                                    HttpStatus.OK,
                                    {
                                        config: config,
                                        ok: true,
                                    },
                                ]];
                        });
                    }); });
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    });
                    return [4 /*yield*/, blockchain.post("http://example.com", { foo: "bar" }, { bar: "foo" })];
                case 1:
                    response = _a.sent();
                    expect(response.config.url).toEqual("http://example.com?bar=foo");
                    expect(response).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should accept custom logger", function () { return __awaiter(_this, void 0, void 0, function () {
        var mockLogger, blockchain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockServer.onGet(/rate/).reply(HttpStatus.OK, {
                        ok: true,
                        coins: {
                            BTC: {
                                coin: "BTC",
                                name: "Bitcoin",
                                rate_eur: 7323.08,
                                rate_utctime: "2018-05-15 14:00:02",
                                rate_utime: 1526392802,
                            },
                            LTC: {
                                coin: "LTC",
                                name: "Litecoin",
                                rate_eur: 121.8,
                                rate_utctime: "2018-05-15 14:00:03",
                                rate_utime: 1526392803,
                            },
                            BCH: {
                                coin: "BCH",
                                name: "Bitcoin Cash",
                                rate_eur: 1180.2,
                                rate_utctime: "2018-05-15 14:00:04",
                                rate_utime: 1526392804,
                            },
                            DASH: {
                                coin: "DASH",
                                name: "Dash",
                                rate_eur: 368.43,
                                rate_utctime: "2018-05-15 14:00:05",
                                rate_utime: 1526392805,
                            },
                        },
                    });
                    mockLogger = {
                        trace: jest.fn(),
                        debug: jest.fn(),
                        info: jest.fn(),
                        warn: jest.fn(),
                        error: jest.fn(),
                    };
                    blockchain = new index_1.Piixpay({
                        key: "xxx",
                    }, mockLogger);
                    return [4 /*yield*/, blockchain.getRates()];
                case 1:
                    _a.sent();
                    // tslint:disable-next-line:no-any
                    expect(mockLogger.debug.mock.calls[0][0].response).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=Piixpay.test.js.map