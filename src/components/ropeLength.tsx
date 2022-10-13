import { useEffect, useState } from "react";
import { merkleRopeContract } from "../util/web3";
import { Card } from "./card";

export const RopeLength = (): JSX.Element => {
  const [ropeLength, setRopeLength] = useState("");

  useEffect(() => {
    async function getRopeLength() {
      const len = await merkleRopeContract.ropeLength();
      setRopeLength(len);
    }
    getRopeLength();
  }, []);

  return <Card name="Rope Length">{ropeLength}</Card>;
};
