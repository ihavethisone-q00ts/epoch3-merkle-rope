import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query as { name: string };
  res.send(`Hello ${name}`);
};
