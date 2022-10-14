import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { merkleRopeContract } from "../util/web3";
import { Card } from "./card";

export const RopeLength = (): JSX.Element => {
  const [ropeLength, setRopeLength] = useState(0);

  useEffect(() => {
    async function getRopeLength() {
      const len = ethers.BigNumber.from(
        await merkleRopeContract.ropeLength()
      ).toNumber();
      setRopeLength(len);
    }
    getRopeLength();
  }, []);

  return <Card name="Rope Length">{ropeLength}</Card>;
};
