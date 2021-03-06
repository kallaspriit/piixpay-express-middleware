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
var express = require("express");
var HttpStatus = require("http-status-codes");
var ts_log_1 = require("ts-log");
var index_1 = require("./index");
exports.default = (function (options) {
    var log = options.log !== undefined ? options.log : ts_log_1.dummyLogger;
    var api = options.api;
    var router = express.Router();
    // handle qr image request
    router.get("/qr", function (request, response, _next) { return __awaiter(_this, void 0, void 0, function () {
        var payload, paymentRequestQrCode;
        return __generator(this, function (_a) {
            payload = request.query.payload;
            paymentRequestQrCode = index_1.getQrCodeImage(payload);
            response.setHeader("Content-Type", "image/png");
            paymentRequestQrCode.pipe(response);
            return [2 /*return*/];
        });
    }); });
    // handle payment update request
    router.post("/handle-payment", function (request, response, _next) { return __awaiter(_this, void 0, void 0, function () {
        var transactionKey, expectedTransactionKeyLength, invoice, e_1, error, reason;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionKey = request.body.transaction_key;
                    expectedTransactionKeyLength = 32;
                    // make sure a valid-looking transaction key was provided
                    if (typeof transactionKey !== "string" || transactionKey.length !== expectedTransactionKeyLength) {
                        log.warn({
                            body: request.body,
                        }, "got invalid payment update request");
                        // respond with bad request
                        response
                            .status(HttpStatus.BAD_REQUEST)
                            .send("Expected request body to include 'transaction_key' with a string value of 32 characters");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, api.getInvoice(transactionKey)];
                case 2:
                    invoice = _a.sent();
                    log.info({
                        transactionKey: transactionKey,
                        invoice: invoice,
                        body: request.body,
                    }, "got payment update");
                    // save invoice
                    return [4 /*yield*/, options.saveInvoice(invoice)];
                case 3:
                    // save invoice
                    _a.sent();
                    // respond with HTTP 200
                    response.send("OK");
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    error = e_1;
                    reason = error.response !== undefined && typeof error.response.data === "string" && error.response.data.length > 0
                        ? error.response.data
                        : error.message;
                    log.warn({
                        error: error,
                        reason: reason,
                        transactionKey: transactionKey,
                    }, "fetching invoice info failed");
                    // handle not found
                    if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
                        response.status(HttpStatus.NOT_FOUND).send("Invoice \"" + transactionKey + "\" could not be found (" + reason + ")");
                        return [2 /*return*/];
                    }
                    // respond with internal error for all other issues
                    response
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Fetching invoice \"" + transactionKey + "\" info failed (" + reason + ")");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    return router;
});
//# sourceMappingURL=middleware.js.map