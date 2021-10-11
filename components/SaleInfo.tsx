import React, { FC } from "react";
import QRCode from "react-qr-code";
import ReactTooltip from "react-tooltip";
import { differenceInSeconds } from "date-fns";

import styles from "@styles/pages/Home.module.scss";
import { TokenSale } from "types/types";

interface IProps {
  tokenSale: TokenSale;
  reset: () => void;
}

export const SaleInfo: FC<IProps> = ({ tokenSale, reset }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>("");
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const addressRef = React.useRef<HTMLParagraphElement | null>(null);
  const priceRef = React.useRef<HTMLParagraphElement | null>(null);

  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      const diff = differenceInSeconds(new Date(tokenSale.validTo), new Date());

      if (diff <= 0) {
        reset();
        if (timerRef.current) clearTimeout(timerRef.current);
      }
      const min = diff <= 0 ? "0" : Math.floor(diff / 60).toString();
      const sec = diff <= 0 ? "00" : (diff % 60).toString().padStart(2, "0");
      setTimeLeft(min + ":" + sec);
    }, 1000);

    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.home__container}>
      <div className={styles.home__qr}>
        <QRCode
          value={`web+cardano:${tokenSale.receivingAddress}`}
          size={220}
        />
      </div>
      <div className={styles.home__payment}>
        <div>Expires in {timeLeft}</div>

        <label className="control-label">
          Send to this Address <small>(click the address to copy)</small>
        </label>
        <p
          ref={addressRef}
          data-tip="<div class='tooltip'><img src='/check-mark.svg' /><span>&nbsp;copied!</span></div>"
          className={styles.home__tooltip}
        />
        <input
          type="text"
          defaultValue={tokenSale.receivingAddress}
          readOnly
          onClick={() => {
            navigator.clipboard.writeText(tokenSale.receivingAddress);
            if (addressRef.current) {
              ReactTooltip.show(addressRef.current);
              setTimeout(
                () =>
                  addressRef.current && ReactTooltip.hide(addressRef.current),
                3000
              );
            }
          }}
        />
        <label className="control-label">
          Send this Amount <small>(click the amount to copy)</small>
        </label>
        <p
          ref={priceRef}
          data-tip="<div class='tooltip'><img src='/check-mark.svg' /><span>&nbsp;copied!</span></div>"
          className={styles.home__tooltip}
        />
        <input
          type="text"
          defaultValue="3"
          readOnly
          onClick={() => {
            navigator.clipboard.writeText("3");
            if (priceRef.current) {
              ReactTooltip.show(priceRef.current);
              setTimeout(
                () => priceRef.current && ReactTooltip.hide(priceRef.current),
                3000
              );
            }
          }}
        />
        <ReactTooltip backgroundColor="white" textColor="#1a1a1a" html={true} />
        <p>
          <strong>REMINDER: DO NOT SEND FUNDS FROM AN EXCHANGE!</strong>
          <br />
          <span>
            You must use a Cardano Shelley-Era wallet such as Daedalus, Yoroi,
            AdaLite, Nami or CC Wallet.
          </span>
        </p>
      </div>
    </div>
  );
};
