import { useEffect, useState } from "react";
import { merkleRopeContract } from "../util/web3";
import { Card } from "./card";

export const CurrentRoot = (): JSX.Element => {
  const [currentRoot, setCurrentRoot] = useState("");

  useEffect(() => {
    async function getCurrentRoot() {
      const root = await merkleRopeContract.currentRoot();
      setCurrentRoot(root);
    }
    getCurrentRoot();
  }, []);

  return <Card name="Current Root">{currentRoot}</Card>;
};
