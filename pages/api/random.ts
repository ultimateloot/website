import type { NextApiRequest, NextApiResponse } from "next";
import { defaultLoot } from "@utils/constants";
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
  try {
    const { captcha } = req.body;
    await verifyCaptcha(captcha);

    const response = await fetch(API_URL + "/traits/random", {
      headers: {
        secret: process.env.API_SECRET || "",
      },
    });
    const random = await response.json();
    res.status(200).json({ ...random });
  } catch (e) {
    console.error("API Error random.ts:");
    console.error(e);
    res.status(200).json({
      traits: defaultLoot.map((d) => d.value),
      error: true,
      errorMessage: (e as Error).message,
    });
  }
}
