import { BigNumber } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { MERKLE_ROPE, provider, merkleRopeContract } from "../../util/web3";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PARTICIPANTS_STORAGE = "0x05";
const DB_TABLE = "epoch3c";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase.from(DB_TABLE).select("participant");

  if (error) {
    res.send("db error");
    return;
  }

  const participants: string[] = data.map((item) => item.participant) || [];

  const chainParticipantsLength = BigNumber.from(
    await provider.getStorageAt(MERKLE_ROPE, PARTICIPANTS_STORAGE)
  ).toNumber();

  if (chainParticipantsLength !== participants.length) {
    const newParticipants: string[] = [];
    for (let i = participants.length; i < chainParticipantsLength; i++) {
      const participant: string = await merkleRopeContract.participants(i);
      newParticipants.push(participant);

      await supabase.from(DB_TABLE).upsert({
        id: i,
        participant,
      });
    }

    participants.push(...newParticipants);
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  res.json({
    participants,
  });
};
