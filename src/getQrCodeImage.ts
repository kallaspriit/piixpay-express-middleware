import * as qr from "qr-image";

/**
 * Generates QR code image with given payload.
 *
 * The image is returned as a readable stream.
 *
 * @param payload QR code payload
 * @param options Optional QR code image options
 */
export default function getQrCodeImage(payload: string, options: Partial<qr.Options> = {}): NodeJS.ReadableStream {
  return qr.image(payload, {
    size: 4,
    type: "png",
    ...options,
  });
}
