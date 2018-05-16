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
// import * as HttpStatus from "http-status-codes";
// import { ILogger } from "ts-log";
// const CALLBACK_URL = "https://example.com";
// const RECEIVING_ADDRESS = "2FupTEd3PDF7HVxNrzNqQGGoWZA4rqiphq";
// const API_KEY = "xxx";
// const XPUB = "yyy";
// const SECRET = "zzz";
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
    // it("should generate a new receiving address", async () => {
    //   mockServer.onGet(/receive/).reply(HttpStatus.OK, {
    //     address: RECEIVING_ADDRESS,
    //     index: 0,
    //     callback: CALLBACK_URL,
    //   });
    //   const blockchain = new Piixpay({
    //     apiKey: API_KEY,
    //     xPub: XPUB,
    //   });
    //   const receivingAddress = await blockchain.generateReceivingAddress(CALLBACK_URL);
    //   expect(receivingAddress).toMatchSnapshot();
    // });
    // it("should throw error when generating receving address and getting a non 2xx response", async () => {
    //   mockServer.onGet(/receive/).reply(HttpStatus.BAD_REQUEST, "Bad request");
    //   const blockchain = new Piixpay({
    //     apiKey: API_KEY,
    //     xPub: XPUB,
    //     gapLimit: 20, // we can provide custom gap limit
    //   });
    //   await expect(blockchain.generateReceivingAddress(CALLBACK_URL)).rejects.toMatchSnapshot();
    // });
    // it("should create a new invoice with receiving address", async () => {
    //   mockServer.onGet(/receive/).reply(HttpStatus.OK, {
    //     address: RECEIVING_ADDRESS,
    //     index: 0,
    //     callback: CALLBACK_URL,
    //   });
    //   const blockchain = new Piixpay({
    //     apiKey: API_KEY,
    //     xPub: XPUB,
    //   });
    //   const invoice = await blockchain.createInvoice({
    //     dueAmount: 1,
    //     message: "Test invoice",
    //     secret: SECRET,
    //     callbackUrl: CALLBACK_URL,
    //   });
    //   expect(processInvoiceForSnapshot(invoice)).toMatchSnapshot();
    // });
    // it("should accept custom logger", async () => {
    //   mockServer.onGet(/receive/).reply(HttpStatus.OK, {
    //     address: RECEIVING_ADDRESS,
    //     index: 0,
    //     callback: CALLBACK_URL,
    //   });
    //   const mockLogger: ILogger = {
    //     trace: jest.fn(),
    //     debug: jest.fn(),
    //     info: jest.fn(),
    //     warn: jest.fn(),
    //     error: jest.fn(),
    //   };
    //   const blockchain = new Piixpay(
    //     {
    //       apiKey: API_KEY,
    //       xPub: XPUB,
    //     },
    //     mockLogger,
    //   );
    //   await blockchain.createInvoice({
    //     dueAmount: 2.5,
    //     message: "Another invoice",
    //     secret: SECRET,
    //     callbackUrl: CALLBACK_URL,
    //   });
    //   // tslint:disable-next-line:no-any
    //   expect((mockLogger.info as any).mock.calls).toMatchSnapshot();
    // });
});
function processInvoiceForSnapshot(invoice) {
    return invoice;
}
exports.processInvoiceForSnapshot = processInvoiceForSnapshot;
//# sourceMappingURL=Piixpay.test.js.map