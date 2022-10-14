import { NextApiRequest, NextApiResponse } from "next";
import { BigNumber } from "ethers";
import { merkleRopeContract } from "../../util/web3";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const ropeLength = BigNumber.from(
    await merkleRopeContract.ropeLength()
  ).toNumber();

  res.json({ ropeLength });
};
