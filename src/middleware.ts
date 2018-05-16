import { AxiosError } from "axios";
import * as express from "express";
import * as HttpStatus from "http-status-codes";
import { dummyLogger, ILogger } from "ts-log";
import { getQrCodeImage, Invoice, Piixpay } from "./index";

export interface IQrCodeParameters {
  payload: string;
}

export interface IHandlePaymentUpdateRequest {
  transaction_key?: string;
}

export interface IOptions {
  api: Piixpay;
  log?: ILogger;
  saveInvoice(invoice: Invoice): Promise<void>;
}

export default (options: IOptions): express.Router => {
  const log = options.log !== undefined ? options.log : dummyLogger;
  const api = options.api;
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
    // extract info
    const { transaction_key: transactionKey } = request.body as IHandlePaymentUpdateRequest;
    const expectedTransactionKeyLength = 32;

    // make sure a valid-looking transaction key was provided
    if (typeof transactionKey !== "string" || transactionKey.length !== expectedTransactionKeyLength) {
      log.warn(
        {
          body: request.body,
        },
        "got invalid payment update request",
      );

      // respond with bad request
      response
        .status(HttpStatus.BAD_REQUEST)
        .send("Expected request body to include 'transaction_key' with a string value of 32 characters");

      return;
    }

    // attempt to fetch invoice info
    try {
      const invoice = await api.getInvoice(transactionKey);

      log.info(
        {
          transactionKey,
          invoice,
          body: request.body,
        },
        "got payment update",
      );

      // save invoice
      await options.saveInvoice(invoice);

      // respond with HTTP 200
      response.send("OK");
    } catch (e) {
      const error: AxiosError = e;
      const reason =
        error.response !== undefined && typeof error.response.data === "string" && error.response.data.length > 0
          ? error.response.data
          : error.message;

      log.warn(
        {
          error,
          reason,
          transactionKey,
        },
        "fetching invoice info failed",
      );

      // handle not found
      if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
        response.status(HttpStatus.NOT_FOUND).send(`Invoice "${transactionKey}" could not be found (${reason})`);

        return;
      }

      // respond with internal error for all other issues
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Fetching invoice "${transactionKey}" info failed (${reason})`);
    }
  });

  return router;
};
