import { getQrCodeImage } from "./index";

const QR_PAYLOAD = "bitcoin:bmitnJQ1OqzZzOGv6abovJxdO1PuSnqn?amount=0.00450000";

describe("getQrCodeImage", () => {
  it("should return correct image", async () => {
    const image = getQrCodeImage(QR_PAYLOAD);

    // can't really say it's correct but at least detect a change
    expect(await streamToString(image)).toMatchSnapshot();
  });

  it("should accept optional qr code options", async () => {
    const image = getQrCodeImage(QR_PAYLOAD, {
      size: 10,
    });

    // can't really say it's correct but at least detect a change
    expect(await streamToString(image)).toMatchSnapshot();
  });
});

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise<string>(resolve => {
    let result = "";

    stream.on("data", chunk => {
      result += chunk;
    });

    stream.on("end", () => {
      resolve(result);
    });
  });
}
