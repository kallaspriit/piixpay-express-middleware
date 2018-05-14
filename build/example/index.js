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
var dotenv = require("dotenv");
var express = require("express");
var fs = require("fs");
var http = require("http");
// import * as HttpStatus from "http-status-codes";
var https = require("https");
var querystring = require("querystring");
var src_1 = require("../src");
// load the .env configuration (https://github.com/motdotla/dotenv)
dotenv.config();
// constants
var HTTP_PORT = 80;
var DEFAULT_PORT = 3000;
var COIN_DECIMAL_PLACES = 4;
// extract configuration from the .env environment variables
var config = {
    server: {
        host: process.env.SERVER_HOST !== undefined ? process.env.SERVER_HOST : "localhost",
        port: process.env.SERVER_PORT !== undefined ? parseInt(process.env.SERVER_PORT, 10) : DEFAULT_PORT,
        useSSL: process.env.SERVER_USE_SSL === "true",
        cert: process.env.SERVER_CERT !== undefined ? process.env.SERVER_CERT : "",
        key: process.env.SERVER_KEY !== undefined ? process.env.SERVER_KEY : "",
    },
    api: {
        key: process.env.API_KEY !== undefined ? process.env.API_KEY : "",
        username: process.env.API_USERNAME !== undefined ? process.env.API_USERNAME : "",
        password: process.env.API_PASSWORD !== undefined ? process.env.API_PASSWORD : "",
    },
};
// invoices "database" emulated with a simple array (store the data only)
var invoiceDatabase = [];
// initiate api
var api = new src_1.Piixpay(config.api, console);
// create the express server application
var app = express();
// parse application/x-www-form-urlencoded and  application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use the blockchain middleware
app.use(src_1.default({
    api: api,
    saveInvoice: saveInvoice,
    log: console,
}));
// handle index view request
app.get("/", function (_request, response, _next) { return __awaiter(_this, void 0, void 0, function () {
    var rates;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api.getRates()];
            case 1:
                rates = _a.sent();
                // show request payment form and list of existing payments
                response.send("\n    <h1>Piixpay gateway</h1>\n\n    <h2>Request payment</h2>\n    <form method=\"post\" action=\"/pay\">\n      <p>\n        <input type=\"text\" name=\"sum_eur\" value=\"5\" /> Amount (EUR)\n      </p>\n      <p>\n        <input type=\"text\" name=\"description\" value=\"Test payment\" /> Description\n      </p>\n      <p>\n        <select name=\"coin\">\n          " + Object.keys(src_1.Coin)
                    .map(function (coinKey) { return "<option value=\"" + src_1.Coin[coinKey] + "\">" + coinKey + "</option>"; })
                    .join("\n") + "\n        </select>\n        Coin\n      </p>\n      <p>\n        <input type=\"submit\" name=\"submit\" value=\"Request payment\" />\n      </p>\n    </form>\n\n    <h2>Payments</h2>\n    " + (invoiceDatabase.length === 0 ? "No payments have been requested" : "") + "\n    <ul>\n      " + invoiceDatabase.map(function (invoice) { return "\n        <li>\n          <a href=\"/invoice/" + invoice.transactionKey + "\">" + invoice.description + "</a>\n          <ul>\n            <li><strong>Transaction key:</strong> " + invoice.transactionKey + "</li>\n            <li><strong>Amount paid:</strong> " + invoice.received.eur + "\u20AC/" + invoice.due.eur + " " + invoice.coin + " (" + invoice.amountStatus + ")</li>\n            <li><strong>Payment status:</strong> " + invoice.paymentStatus + "</li>\n          </ul>\n        </li>\n      "; }) + "\n    </ul>\n\n    <h2>Rates</h2>\n    <pre>" + JSON.stringify(rates, undefined, "  ") + "</pre>\n  ");
                return [2 /*return*/];
        }
    });
}); });
// function difference(object: Dictionary<{}>, base: Dictionary<{}>) {
//   return transform(object, (result, value, key) => {
//     if (!isEqual(value, base[key])) {
//       result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
//     }
//   });
// }
// handle payment form request
app.post("/pay", function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, sum_eur, description, coin, invoice, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, sum_eur = _a.sum_eur, description = _a.description, coin = _a.coin;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api.createInvoice({
                        sum_eur: sum_eur,
                        description: description,
                        coin: coin,
                    })];
            case 2:
                invoice = _b.sent();
                // let lastInvoice = invoice;
                // // start polling for updates
                // invoice.startPolling(api, (error, updatedInvoice) => {
                //   if (!updatedInvoice || error !== null) {
                //     console.error({ error }, "failed to get invoice info");
                //     return;
                //   }
                //   const hasInvoiceChanged = !lastInvoice.isSameAs(updatedInvoice);
                //   const invoiceDifference = difference(invoice.toJSON(), updatedInvoice.toJSON());
                //   lastInvoice = updatedInvoice;
                //   console.log(
                //     {
                //       error,
                //       hasInvoiceChanged,
                //       invoiceDifference,
                //       lastInvoice,
                //       updatedInvoice,
                //     },
                //     "got invoice poll result",
                //   );
                // });
                // save the invoice (this would normally hit an actual database)
                return [4 /*yield*/, saveInvoice(invoice)];
            case 3:
                // let lastInvoice = invoice;
                // // start polling for updates
                // invoice.startPolling(api, (error, updatedInvoice) => {
                //   if (!updatedInvoice || error !== null) {
                //     console.error({ error }, "failed to get invoice info");
                //     return;
                //   }
                //   const hasInvoiceChanged = !lastInvoice.isSameAs(updatedInvoice);
                //   const invoiceDifference = difference(invoice.toJSON(), updatedInvoice.toJSON());
                //   lastInvoice = updatedInvoice;
                //   console.log(
                //     {
                //       error,
                //       hasInvoiceChanged,
                //       invoiceDifference,
                //       lastInvoice,
                //       updatedInvoice,
                //     },
                //     "got invoice poll result",
                //   );
                // });
                // save the invoice (this would normally hit an actual database)
                _b.sent();
                // redirect user to invoice view (use address as unique id)
                response.redirect("/invoice/" + invoice.transactionKey);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// handle invoice request
app.get("/invoice/:transactionKey", function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
    var invoice, qrCodeImageUrl, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.getInvoice(request.params.transactionKey)];
            case 1:
                invoice = _a.sent();
                qrCodeImageUrl = "/qr?" + querystring.stringify({ payload: invoice.paymentUrl });
                response.send("\n      <h1>Invoice</h1>\n\n      <ul>\n        <li><strong>Transaction key:</strong> " + invoice.transactionKey + "</li>\n        <li><strong>Is complete:</strong> " + invoice.isComplete + "</li>\n        <li><strong>Receiver:</strong> " + invoice.receiver.name + " - " + invoice.receiver.iban + "</li>\n        <li><strong>Payment status:</strong> " + invoice.paymentStatus + "</li>\n        <li><strong>Amount status:</strong> " + invoice.amountStatus + "</li>\n        <li><strong>Amount:</strong> " + invoice.amount.eur + "\u20AC (" + invoice.amount.coin.toFixed(COIN_DECIMAL_PLACES) + " " + invoice.coin + ")</li>\n        <li><strong>Due:</strong> " + invoice.due.eur + "\u20AC (" + invoice.due.coin + " " + invoice.coin + ")</li>\n        <li><strong>Received:</strong> " + invoice.received.coin + " " + invoice.coin + " / " + invoice.due.coin + " " + invoice.coin + "</li>\n        <li><strong>Service fees:</strong> " + invoice.fees.service.eur + "\u20AC (" + invoice.fees.service.coin + " " + invoice.coin + ")</li>\n        <li><strong>Bank fees:</strong> " + invoice.fees.bank.eur + "\u20AC (" + invoice.fees.bank.coin + " " + invoice.coin + ")</li>\n        <li><strong>Total fees:</strong> " + invoice.fees.total.eur + "\u20AC (" + invoice.fees.total.coin + " " + invoice.coin + ")</li>\n        <li><strong>Rate:</strong> 1 " + invoice.coin + " = " + invoice.rate + "\u20AC</li>\n      </ul>\n\n      <img src=\"" + qrCodeImageUrl + "\"/>\n\n      <h2>Raw</h2>\n      <pre>" + JSON.stringify(invoice, undefined, "  ") + "</pre>\n    ");
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// create either http or https server depending on SSL configuration
var server = config.server.useSSL
    ? https.createServer({
        cert: fs.readFileSync(config.server.cert),
        key: fs.readFileSync(config.server.key),
    }, app)
    : http.createServer(app);
// start the server
server.listen({
    host: "0.0.0.0",
    port: config.server.port,
}, function () {
    console.log("server started on port " + config.server.port);
});
// also start a http server to redirect to https if ssl is enabled
if (config.server.useSSL) {
    express()
        .use(function (request, response, _next) {
        response.redirect("https://" + request.hostname + request.originalUrl);
    })
        .listen(HTTP_PORT);
}
function saveInvoice(invoice) {
    return __awaiter(this, void 0, void 0, function () {
        var existingInvoiceIndex;
        return __generator(this, function (_a) {
            existingInvoiceIndex = invoiceDatabase.findIndex(function (item) { return item.transactionKey === invoice.transactionKey; });
            if (existingInvoiceIndex !== -1) {
                invoiceDatabase[existingInvoiceIndex] = invoice;
                console.log({ invoice: invoice }, "updated invoice");
            }
            else {
                invoiceDatabase.push(invoice);
                console.log({ invoice: invoice }, "added invoice");
            }
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=index.js.map