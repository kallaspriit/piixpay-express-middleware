import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
// import * as HttpStatus from "http-status-codes";
import * as https from "https";
import * as querystring from "querystring";
import blockchainMiddleware, { Coin, Invoice, Piixpay } from "../src";

// load the .env configuration (https://github.com/motdotla/dotenv)
dotenv.config();

// constants
const HTTP_PORT = 80;
const DEFAULT_PORT = 3000;
const COIN_DECIMAL_PLACES = 4;

// extract configuration from the .env environment variables
const config = {
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
const invoiceDatabase: Invoice[] = [];

// initiate api
const api = new Piixpay(config.api, console);

// create the express server application
const app = express();

// parse application/x-www-form-urlencoded and  application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use the blockchain middleware
app.use(
  blockchainMiddleware({
    api,
    saveInvoice,
    log: console,
  }),
);

// handle index view request
app.get("/", async (_request, response, _next) => {
  const rates = await api.getRates();

  // show request payment form and list of existing payments
  response.send(`
    <h1>Piixpay gateway</h1>

    <h2>Request payment</h2>
    <form method="post" action="/pay">
      <p>
        <input type="text" name="sum_eur" value="5" /> Amount (EUR)
      </p>
      <p>
        <input type="text" name="description" value="Test payment" /> Description
      </p>
      <p>
        <select name="coin">
          ${Object.keys(Coin)
            .map(coinKey => `<option value="${Coin[coinKey as Coin]}">${coinKey}</option>`)
            .join("\n")}
        </select>
        Coin
      </p>
      <p>
        <input type="submit" name="submit" value="Request payment" />
      </p>
    </form>

    <h2>Payments</h2>
    ${invoiceDatabase.length === 0 ? "No payments have been requested" : ""}
    <ul>
      ${invoiceDatabase.map(
        invoice => `
        <li>
          <a href="/invoice/${invoice.transactionKey}">${invoice.description}</a>
          <ul>
            <li><strong>Transaction key:</strong> ${invoice.transactionKey}</li>
            <li><strong>Amount paid:</strong> ${invoice.received.eur}€/${invoice.due.eur} ${invoice.coin} (${
          invoice.amountStatus
        })</li>
            <li><strong>Payment status:</strong> ${invoice.paymentStatus}</li>
          </ul>
        </li>
      `,
      )}
    </ul>

    <h2>Rates</h2>
    <pre>${JSON.stringify(rates, undefined, "  ")}</pre>
  `);
});

// function difference(object: Dictionary<{}>, base: Dictionary<{}>) {
//   return transform(object, (result, value, key) => {
//     if (!isEqual(value, base[key])) {
//       result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
//     }
//   });
// }

// handle payment form request
app.post("/pay", async (request, response, next) => {
  // extract invoice info from the request payment form (you'd normally want to validate these)
  const { sum_eur, description, coin } = request.body;

  try {
    // create invoice
    const invoice = await api.createInvoice({
      sum_eur,
      description,
      coin,
    });

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
    await saveInvoice(invoice);

    // redirect user to invoice view (use address as unique id)
    response.redirect(`/invoice/${invoice.transactionKey}`);
  } catch (error) {
    next(error);
  }
});

// handle invoice request
app.get("/invoice/:transactionKey", async (request, response, next) => {
  try {
    const invoice = await api.getInvoice(request.params.transactionKey);
    const qrCodeImageUrl = `/qr?${querystring.stringify({ payload: invoice.paymentUrl })}`;

    response.send(`
      <h1>Invoice</h1>

      <ul>
        <li><strong>Transaction key:</strong> ${invoice.transactionKey}</li>
        <li><strong>Is complete:</strong> ${invoice.isComplete}</li>
        <li><strong>Receiver:</strong> ${invoice.receiver.name} - ${invoice.receiver.iban}</li>
        <li><strong>Payment status:</strong> ${invoice.paymentStatus}</li>
        <li><strong>Amount status:</strong> ${invoice.amountStatus}</li>
        <li><strong>Amount:</strong> ${invoice.amount.eur}€ (${invoice.amount.coin.toFixed(COIN_DECIMAL_PLACES)} ${
      invoice.coin
    })</li>
        <li><strong>Due:</strong> ${invoice.due.eur}€ (${invoice.due.coin} ${invoice.coin})</li>
        <li><strong>Received:</strong> ${invoice.received.coin} ${invoice.coin} / ${invoice.due.coin} ${
      invoice.coin
    }</li>
        <li><strong>Service fees:</strong> ${invoice.fees.service.eur}€ (${invoice.fees.service.coin} ${
      invoice.coin
    })</li>
        <li><strong>Bank fees:</strong> ${invoice.fees.bank.eur}€ (${invoice.fees.bank.coin} ${invoice.coin})</li>
        <li><strong>Total fees:</strong> ${invoice.fees.total.eur}€ (${invoice.fees.total.coin} ${invoice.coin})</li>
        <li><strong>Rate:</strong> 1 ${invoice.coin} = ${invoice.rate}€</li>
      </ul>

      <img src="${qrCodeImageUrl}"/>

      <h2>Raw</h2>
      <pre>${JSON.stringify(invoice, undefined, "  ")}</pre>
    `);

    // response.send(invoice);
  } catch (error) {
    next(error);
  }
});

// create either http or https server depending on SSL configuration
const server = config.server.useSSL
  ? https.createServer(
      {
        cert: fs.readFileSync(config.server.cert),
        key: fs.readFileSync(config.server.key),
      },
      app,
    )
  : http.createServer(app);

// start the server
server.listen(
  {
    host: "0.0.0.0",
    port: config.server.port,
  },
  () => {
    console.log(`server started on port ${config.server.port}`);
  },
);

// also start a http server to redirect to https if ssl is enabled
if (config.server.useSSL) {
  express()
    .use((request, response, _next) => {
      response.redirect(`https://${request.hostname}${request.originalUrl}`);
    })
    .listen(HTTP_PORT);
}

async function saveInvoice(invoice: Invoice): Promise<void> {
  const existingInvoiceIndex = invoiceDatabase.findIndex(item => item.transactionKey === invoice.transactionKey);

  if (existingInvoiceIndex !== -1) {
    invoiceDatabase[existingInvoiceIndex] = invoice;

    console.log({ invoice }, "updated invoice");
  } else {
    invoiceDatabase.push(invoice);

    console.log({ invoice }, "added invoice");
  }
}
