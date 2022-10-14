import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { merkleRopeContract } from "../../util/web3";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const len = ethers.BigNumber.from(
    await merkleRopeContract.ropeLength()
  ).toNumber();

  res.send(len);
};
