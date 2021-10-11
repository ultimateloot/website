import type { ReactElement } from "react";
import Layout from "@components/Layout";
import styles from "@styles/pages/FAQ.module.scss";

export default function FAQ(): ReactElement {
  return (
    <Layout>
      <div className={styles.faq}>
        <h2>Frequently Asked Questions</h2>

        <div className={styles.faq__item}>
          <h3>What is Ultimate Loot?</h3>
          <p>
            Ultimate Loot is a collection of unique bags of adventurer gear.
            Each Ultimate Loot bag contains 8 items: a piece for an
            adventurer&apos;s weapon, chest, head, waist, foot, hand, neck and
            ring.
          </p>
          <p>
            It is heavily inspired by the original{" "}
            <a
              href="https://www.lootproject.com/"
              target="_blank"
              rel="noreferrer"
            >
              Loot (for Adventurers)
            </a>
            .
          </p>
        </div>

        <div className={styles.faq__item}>
          <h3>Why is Ultimate Loot special?</h3>
          <p>
            The original Loot (for Adventurers) was the first of its kind with
            many following derivative projects. Unfortunatly all on the Ethereum
            blockchain, which has a major disadvantage in the form of high gas
            fees.
          </p>
          <p>
            Ultimate Loot is build on Cardano, the 3rd generation blockchain,
            with such low fees, that they dont make any impact.
          </p>
          <p>
            With Ultimate Loot the descision power is given to the people.
            <ul>
              <li>You can decide which bag you want.</li>
              <li>You can decide how many Ultimate Loots there should be.</li>
              <li>You can decide on the rarity structure.</li>
            </ul>
            <strong>No more descisions top down.</strong>
          </p>
          <p>
            Ultimate Loot is the unfiltered, uncensorable building block for
            stories, experiences, games, and more, in the hands of the
            community, at nearly no costs. Ultimate Loot pursues complete
            decentralization from day one.
          </p>
        </div>

        <div className={styles.faq__item}>
          <h3>Can I build with Ulimate Loot?</h3>
          <p>Yes, you are free to use Ultimate Loot in any way you want.</p>
        </div>

        <div className={styles.faq__item}>
          <h3>How does it work?</h3>
          <p>
            You choose your Ultimate Loot bag and if it is not minted in that
            combination you can click on buy.
            <br />
            Send 3 ADA to the address shown and you receive your Ulitmate Loot
            bag with 2 ADA back.
          </p>
          <p>
            You must use a Cardano Shelley-Era wallet such as Daedalus, Yoroi,
            AdaLite, Nami or CC Wallet.
            <br />
            Do not send from an exchange.
          </p>
        </div>

        <div className={styles.faq__item}>
          <h3>What is the Policy Id?</h3>
          <p>f5e035683dbd453e3d769a994c584e750b60dad366ccb80639d9df2b</p>
        </div>

        <div className={styles.faq__item}>
          <h3>Future plans?</h3>
          <p>Maybe after the minting window we create a rarity score.</p>
          <p>
            Maybe we integrate some smart contracts to interact with the
            Ulitmate Loot bags.
          </p>

          <p>But in general the community should decide.</p>
        </div>
      </div>
    </Layout>
  );
}
