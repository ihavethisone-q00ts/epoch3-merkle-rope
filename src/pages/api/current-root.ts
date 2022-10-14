import { NextApiRequest, NextApiResponse } from "next";
import { merkleRopeContract } from "../../util/web3";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const root = await merkleRopeContract.currentRoot();

  res.send(root);
};
