export const verifyCaptcha = async (captchaToken:string) => {
  var requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
  const captchaResponse = await fetch(url, requestOptions);
  const captchaJson = await captchaResponse.json();

  if (!captchaJson.success) {
    throw new Error(
      `captcha failed, error-codes: ${
        captchaJson["error-codes"]
          ? captchaJson["error-codes"].toString()
          : "-"
      }`
    );
  }
}