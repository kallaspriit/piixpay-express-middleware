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
var bodyParser = require("body-parser");
var express = require("express");
var querystring = require("querystring");
var supertest = require("supertest");
var _1 = require("./");
// invoices "database" emulated with a simple array
var invoiceDatabase = [];
var server;
// tslint:disable:no-magic-numbers
describe("middleware", function () {
    beforeEach(function () {
        // create app
        var app = express();
        // parse application/x-www-form-urlencoded and  application/json
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        // use the blockchain middleware
        app.use("/payment", _1.default({
            saveInvoice: saveInvoice,
            loadInvoice: loadInvoice,
        }));
        server = supertest(app);
    });
    afterEach(function () {
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
function loadInvoice(transactionKey) {
    return __awaiter(this, void 0, void 0, function () {
        var invoice;
        return __generator(this, function (_a) {
            invoice = invoiceDatabase.find(function (item) { return item.transactionKey === transactionKey; });
            if (!invoice) {
                return [2 /*return*/, undefined];
            }
            return [2 /*return*/, invoice];
        });
    });
}
//# sourceMappingURL=middleware.test.js.map