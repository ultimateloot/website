import React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Select, { StylesConfig, createFilter } from "react-select";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import Layout from "@components/Layout";
import { SaleInfo } from "@components/SaleInfo";
import { defaultLoot } from "@utils/constants";
import { traitOptions } from "@utils/traits";
import { getFontSizeToFit } from "@utils/getFontSizeToFit";
import styles from "@styles/pages/Home.module.scss";
import { TokenSale } from "types/types";

const customStyles: StylesConfig = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#ffffff" : "#e7e7e7",
    backgroundColor: state.isSelected ? "#6d6b6b" : "#4d4d4d",
    textAlign: "left",
    "&:hover": {
      backgroundColor: "#6d6b6b",
    },
  }),
  menu: (provided, state) => ({
    ...provided,
    marginTop: "4px",
    background: "#4d4d4d",
    width: 400,
  }),
  control: (provided, state) => ({
    ...provided,
    textAlign: "left",
    boxShadow: "none",
    borderColor: state.isFocused ? "#8e8e8e" : "#8e8e8e",
    background: "#1a1a1a",
    width: 400,
    "&:hover": {
      border: "1px solid white",
    },
    marginBottom: "4px",
  }),
  input: (provided, state) => ({
    ...provided,
    color: "#ffffff",
  }),
  singleValue: (provided, state) => ({ ...provided, color: "#ffffff" }),
};

interface IProps {
  initTraits: string[];
}

export default function Home(props: IProps) {
  const { initTraits } = props;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [traits, setTraits] = React.useState<
    { label: string; value: string }[]
  >(initTraits.map((trait) => ({ label: trait, value: trait })));
  const [available, setAvailable] = React.useState<boolean>(true);
  const [tokenSale, setTokenSale] = React.useState<TokenSale | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const resetSale = () => {
    setTokenSale(null);
  };

  const handleReCaptchaVerify = React.useCallback(
    async (action?: string) => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
        return;
      }
      const token = await executeRecaptcha(action);
      return token;
    },
    [executeRecaptcha]
  );

  const checkTraits = React.useCallback(async (): Promise<boolean> => {
    try {
      const token = await handleReCaptchaVerify("random");
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traits: traits.map((t) => t.value),
          captcha: token,
        }),
      });
      const result = await response.json();
      if (result.status && result.status == "available") {
        setAvailable(true);
        return true;
      } else {
        setAvailable(false);
        return false;
      }
    } catch (e) {
      setAvailable(false);
      return false;
    }
  }, [handleReCaptchaVerify, traits]);

  const fetchRandom = async () => {
    const token = await handleReCaptchaVerify("random");
    const response = await fetch("/api/random", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ captcha: token }),
    });
    const result = await response.json();
    if (result.traits) {
      setTraits(
        result.traits.map((trait: string) => ({ label: trait, value: trait }))
      );
      setTokenSale(null);
    }
  };

  const reserveToken = async () => {
    if (!(await checkTraits())) return;
    try {
      const token = await handleReCaptchaVerify("random");
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traits: traits.map((t) => t.value),
          captcha: token,
        }),
      });
      const result = await response.json();
      if (result.errors && result.erros.length) {
        setAvailable(false);
      } else if (result.tokenSale) {
        setTokenSale(result.tokenSale as TokenSale);
      }
    } catch (e) {
      setAvailable(false);
      setTokenSale(null);
    }
  };

  React.useEffect(() => {
    (async function () {
      if (!executeRecaptcha) return;
      await checkTraits();
      setTokenSale(null);
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const size = 400;
          const scale = window.devicePixelRatio; // 2

          canvas.style.width = size + "px";
          canvas.style.height = size + "px";

          canvas.width = Math.floor(size * scale);
          canvas.height = Math.floor(size * scale);

          ctx.scale(scale, scale);

          ctx.font = "20px EB Garamond,serif,sans-serif";
          ctx.fillStyle = "white";
          ctx.textBaseline = "top";
          ctx.textAlign = "left";

          const id = "0000";
          const sidePadding = 20;
          const topPadding = 28;
          const maxWidth = size - 2 * sidePadding;
          const defaultFontSize = 20;

          const fontFace = "EB Garamond,serif,sans-serif";
          traits.forEach((traitOption, index) => {
            const trait = traitOption.value;
            ctx.font = `${defaultFontSize}px EB Garamond,serif,sans-serif`;
            const textWidth = ctx.measureText(trait).width;

            if (textWidth > maxWidth) {
              const fontSize = getFontSizeToFit(
                ctx,
                trait,
                maxWidth,
                fontFace,
                defaultFontSize
              );
              ctx.font = fontSize + "px EB Garamond,serif,sans-serif";
            }
            ctx.fillText(trait, sidePadding, topPadding + index * 32);
          });

          ctx.font = "16px EB Garamond,serif,sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(
            "#" + id,
            canvas.width / scale - sidePadding / 2,
            sidePadding / 2
          );

          if (!available) {
            const font = "52px EB Garamond,serif,sans-serif";
            ctx.font = font;
            ctx.save();
            // ctx.translate(canvas.width / 3.3, canvas.height / 8); // scale 2
            ctx.translate(
              canvas.width / (1.65 * scale),
              canvas.height / (4 * scale)
            ); // scale 1
            ctx.rotate(-0.25 * Math.PI);
            var rText = "not available";
            ctx.fillStyle = "#ff000080";
            ctx.fillRect(
              -canvas.width / (1.6 * scale),
              -4,
              canvas.width / (1.55 * scale),
              54
            );
            ctx.fillStyle = "#ffffff";
            ctx.fillText(rText, 0, 0);
            ctx.restore();
          }
        }
      }
    })();
  }, [traits, available, executeRecaptcha, checkTraits]);

  const quicklinks: Record<string, string>[] = [
    {
      name: "Twitter",
      url: "https://twitter.com/ultLootCNFT",
    },
    { name: "Github", url: "https://github.com/ultimateloot/website" },
    {
      name: "Policy",
      url: "https://cardanoscan.io/tokenPolicy/cb2908ff25b6d559a7799b3323760f8c23ed6a61f9d407e871e98c5c",
    },
  ];

  return (
    <Layout>
      <div>
        <div className={styles.home__cta}>
          <h1>Ultimate Loot</h1>

          <ul>
            {quicklinks.map(({ name, url }, i) => {
              return (
                <li key={i}>
                  {url.startsWith("/") ? (
                    <Link href={url}>
                      <a>{name}</a>
                    </Link>
                  ) : (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <p>
            Ulimate Loot is customized adventurer gear generated and stored on
            cardano.
            <br /> Stats, images, and other functionality are intentionally
            omitted for others to interpret. <br /> Feel free to use Ulimate
            Loot in any way you want.
          </p>
        </div>

        <div className={styles.home__feature}>
          <span>
            Configure your Ultimate Loot, or get a random one. If it&apos;s
            available you can mint it.
          </span>
          <button className={styles.button} onClick={fetchRandom}>
            Random
          </button>

          <div className={styles.home__container}>
            <div className={styles.home__options}>
              <span>
                weapon / chest / head / waist / foot / hand / neck / ring
              </span>
              {traits.map((trait, index) => (
                <Select
                  key={"select_" + index}
                  options={traitOptions[index]}
                  styles={customStyles}
                  filterOption={createFilter({ ignoreAccents: false })}
                  value={trait}
                  onChange={(value) => {
                    const newTraits = [...traits];
                    newTraits[index] = value as any;
                    setTraits(newTraits);
                  }}
                />
              ))}
            </div>
            <div className={styles.home__bag}>
              <canvas
                ref={canvasRef}
                width="400"
                height="400"
                style={{
                  background: "url('./background.png')",
                  backgroundSize: "contain",
                }}
              />
              <button
                className={styles.button}
                onClick={reserveToken}
                disabled={!available}
              >
                Buy
              </button>
            </div>
          </div>
        </div>

        {tokenSale && <SaleInfo tokenSale={tokenSale} reset={resetSale} />}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const API_URL = process.env.API_URL;
  try {
    const response = await fetch(API_URL + "/traits/random", {
      headers: {
        secret: process.env.API_SECRET || "",
      },
    });
    const random = await response.json();

    return {
      props: {
        initTraits: random.traits || [],
      },
    };
  } catch (e) {
    console.error("Error getServerSideProps index.tsx:");
    console.error(e);
    return {
      props: {
        initTraits: defaultLoot.map((d) => d.value) || [],
      },
    };
  }
};
