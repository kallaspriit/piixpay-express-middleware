import * as express from "express";
import { dummyLogger, ILogger } from "ts-log";
import { getQrCodeImage, Invoice } from "./index";

export interface IQrCodeParameters {
  payload: string;
}

export interface IOptions {
  log?: ILogger;
  saveInvoice(invoice: Invoice): Promise<void>;
  loadInvoice(address: string): Promise<Invoice | undefined>;
}

// export type InvoiceUpdateCallback = (error: Error | null, info?: IInvoiceInfo) => void;

export default (options: IOptions): express.Router => {
  const log = options.log !== undefined ? options.log : dummyLogger;
  const router = express.Router();

  // handle qr image request
  router.get("/qr", async (request, response, _next) => {
    // TODO: validate request parameters (json schema?)
    const { payload } = request.query as IQrCodeParameters;

    const paymentRequestQrCode = getQrCodeImage(payload);

    response.setHeader("Content-Type", "image/png");
    paymentRequestQrCode.pipe(response);
  });

  // handle payment update request
  router.post("/handle-payment", async (request, response, _next) => {
    log.info(
      {
        body: request.body,
      },
      "handling payment status",
    );

    response.send("ok");

    // // TODO: validate request parameters (json schema?)
    // const { signature, address, transaction_hash: transactionHash, value, confirmations } = request.query;
    // const invoiceInfo = await options.loadInvoice(address);

    // // give up if an invoice with given address could not be found
    // if (!invoiceInfo) {
    //   log.info(
    //     {
    //       query: request.query,
    //     },
    //     "invoice could not be found",
    //   );

    //   // still send the OK response as we don't want any more updates on this invoice
    //   response.send(OK_RESPONSE);

    //   return;
    // }

    // // de-serialize the invoice
    // const invoice = new Invoice(invoiceInfo);

    // // calculate expected signature
    // const expectedSignature = invoice.getSignature(options.secret);

    // // validate payment update
    // const isSignatureValid = signature === expectedSignature;
    // const isAddressValid = invoice.address === address;
    // const isHashValid = true; // TODO: actually validate hash
    // const isUpdateValid = isSignatureValid && isAddressValid && isHashValid;

    // // respond with bad request if update was not valid
    // if (!isUpdateValid) {
    //   // log failing update info
    //   log.warn(
    //     {
    //       query: request.query,
    //       info: { signature, address, transactionHash, value, confirmations },
    //       invoice,
    //       isSignatureValid,
    //       isAddressValid,
    //       isHashValid,
    //       isUpdateValid,
    //     },
    //     "got invalid payment update",
    //   );

    //   // respond with bad request
    //   response.status(HttpStatus.BAD_REQUEST).send("got invalid payment status update");

    //   return;
    // }

    // // don't update an invoice that is already complete, also stop status updates
    // if (invoice.isComplete()) {
    //   response.send(OK_RESPONSE);

    //   return;
    // }

    // // adds new transaction or updates an existing one if already exists
    // try {
    //   invoice.registerTransaction({
    //     hash: transactionHash,
    //     amount: parseInt(value, 10),
    //     confirmations: parseInt(confirmations, 10),
    //   });
    // } catch (error) {
    //   log.warn(
    //     {
    //       query: request.query,
    //       info: { signature, address, transactionHash, value, confirmations },
    //       invoice,
    //       isSignatureValid,
    //       isAddressValid,
    //       isHashValid,
    //       isUpdateValid,
    //     },
    //     "got invalid transaction",
    //   );

    //   // respond with bad request
    //   response.status(HttpStatus.BAD_REQUEST).send("got bad transaction");

    //   return;
    // }

    // // remember previous state and resolve new state
    // const previousState = invoice.getPaymentStatus();
    // let newState = previousState;

    // // check whether we have enough confirmations
    // const hasSufficientConfirmations = invoice.hasSufficientConfirmations(options.requiredConfirmations);

    // // resolve new state
    // newState = hasSufficientConfirmations
    //   ? InvoicePaymentStatus.CONFIRMED
    //   : InvoicePaymentStatus.WAITING_FOR_CONFIRMATION;

    // // update invoice payment state
    // invoice.setPaymentState(newState);

    // // check whether invoice was just paid
    // if (previousState !== InvoicePaymentStatus.CONFIRMED && newState === InvoicePaymentStatus.CONFIRMED) {
    //   // ship out the products etc..
    //   // TODO: call some handler
    //   log.info(invoice, "invoice is now confirmed");
    // }

    // // check whether handling given invoice is complete and respond accordingly
    // const isComplete = invoice.isComplete();
    // const responseText = isComplete ? OK_RESPONSE : PENDING_RESPONSE;

    // // log the request info
    // log.info(
    //   {
    //     query: request.query,
    //     info: { signature, address, transactionHash, value, confirmations },
    //     invoice,
    //     isSignatureValid,
    //     isAddressValid,
    //     isHashValid,
    //     isUpdateValid,
    //     isComplete,
    //   },
    //   "got valid payment update",
    // );

    // // save the invoice
    // await options.saveInvoice(invoice);

    // // respond with ok if we have reached a final state (will not get new updates after this)
    // response.send(responseText);
  });

  return router;
};

// function startPolling(callback: InvoiceUpdateCallback) {
//   const pollInterval = 10000; // TODO: based on age

//   scheduleNextPoll((error, info) => {
//     // tslint:disable-next-line:no-null-keyword
//     callback(error, info);

//     scheduleNextPoll(callback, pollInterval);
//   }, pollInterval);
// }

// function scheduleNextPoll(callback: InvoiceUpdateCallback, timeout: number): NodeJS.Timer {
//   return setTimeout(async () => {
//     try {
//       const info = await this.fetchCurrentInfo();

//       // tslint:disable-next-line:no-null-keyword
//       callback(null, info);
//     } catch (error) {
//       callback(error);
//     }
//   }, timeout);
// }

// function async fetchCurrentInfo(): Promise<IInvoiceInfo> {
//   const info = {} as IInvoiceInfo;

//   this.description = "updated";

//   return info;
// }
