import type { NextApiRequest, NextApiResponse } from "next";
import { verifyCaptcha } from "@utils/serverCaptchaVerification";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

type Data = {
  traits: string[];
  error?: boolean;
  errorMessage?: string;
};

const API_URL = process.env.API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { traits, captcha } = req.body;
  try {
    await verifyCaptcha(captcha);

    var requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        secret: process.env.API_SECRET || "",
      },
      body: JSON.stringify({
        traits: traits,
      }),
    };

    const response = await fetch(API_URL + "/traits/check", requestOptions);

    const check = await response.json();
    res.status(200).json({ ...check });
  } catch (e) {
    console.error("API Error check.ts:");
    console.error(e);
    res.status(200).json({
      traits,
      error: true,
      errorMessage: (e as Error).message,
    });
  }
}
