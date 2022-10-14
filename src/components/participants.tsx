import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../util/helper";
import type { ParticipantsResponse } from "../util/types";
import { Card } from "./card";
import { MerkleProof } from "./merkleProof";

type ParticipantsProps = {
  address: string;
};

export const Participants = ({ address }: ParticipantsProps): JSX.Element => {
  const [participated, setParticipated] = useState(false);
  const { data, error } = useSWR<ParticipantsResponse>(
    "/api/participants",
    fetcher
  );

  useEffect(() => {
    const participantsSet = new Set(data?.participants);
    if (participantsSet.has(address)) {
      setParticipated(true);
    }
  }, [data?.participants, address]);

  if (error) {
    console.error(error);
    return <Card name="Participants number">Failed to load</Card>;
  }
  if (!data) return <Card name="Participants number">Loading...</Card>;

  return (
    <>
      <Card name="Participants number">{data.participants.length}</Card>
      {(participated && <Card name="This wallet is already a digger." />) || (
        <MerkleProof participants={data.participants} />
      )}
    </>
  );
};
