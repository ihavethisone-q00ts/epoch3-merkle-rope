import { useAddress } from "@thirdweb-dev/react";
import { Participants } from "./participants";
import { Card } from "./card";
import { CurrentRoot } from "./currentRoot";
import { initialLeaves } from "../util/leaves";
import { RopeLength } from "./ropeLength";

export const Address = (): JSX.Element => {
  const address = useAddress();

  if (!address) {
    return <Card name="Please connect your wallet." />;
  }

  if (!initialLeaves.includes(address)) {
    return (
      <Card name="Your wallet is not on the whitelist. Please use another." />
    );
  }

  return (
    <>
      <CurrentRoot />
      <RopeLength />
      <Participants address={address} />
    </>
  );
};
