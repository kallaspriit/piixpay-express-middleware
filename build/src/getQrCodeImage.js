"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var qr = require("qr-image");
/**
 * Generates QR code image with given payload.
 *
 * The image is returned as a readable stream.
 *
 * @param payload QR code payload
 * @param options Optional QR code image options
 */
function getQrCodeImage(payload, options) {
    if (options === void 0) { options = {}; }
    return qr.image(payload, __assign({ size: 4, type: "png" }, options));
}
exports.default = getQrCodeImage;
//# sourceMappingURL=getQrCodeImage.js.map