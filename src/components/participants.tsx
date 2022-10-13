import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { provider, MERKLE_ROPE } from "../util/web3";
import { Card } from "./card";
import { MerkleProof } from "./merkleProof";

type ParticipantsProps = {
  address: string;
};

const PARTICIPANTS_STORAGE = "0x05";

export const Participants = ({ address }: ParticipantsProps): JSX.Element => {
  const [loaded, setLoaded] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [participated, setParticipated] = useState(false);
  const [participantsLength, setParticipantsLength] = useState<number | null>();

  useEffect(() => {
    async function getParticipants() {
      const participantsLength = ethers.BigNumber.from(
        await provider.getStorageAt(MERKLE_ROPE, PARTICIPANTS_STORAGE)
      ).toNumber();
      setParticipantsLength(participantsLength);

      if (participantsLength > 0) {
        const participants = [];

        for (let i = 0; i < participantsLength; i++) {
          const storageIndex = ethers.BigNumber.from(PARTICIPANTS_STORAGE)
            .add(i)
            .toHexString();
          const storageIndexPadded = ethers.utils.hexZeroPad(storageIndex, 32);

          const participant = await provider.getStorageAt(
            MERKLE_ROPE,
            ethers.utils.keccak256(storageIndexPadded)
          );

          const participantAddress = ethers.utils.defaultAbiCoder.decode(
            ["address"],
            participant
          );

          participants.push(...participantAddress);
        }

        console.log({ participants });
        setParticipants(participants);
      }
      setLoaded(true);
    }

    getParticipants();
  }, []);

  useEffect(() => {
    const participantsSet = new Set(participants);
    if (participantsSet.has(address)) {
      setParticipated(true);
    }
  }, [participants, address]);

  if (!loaded) {
    return <Card name="Fetching data..." />;
  }

  return (
    <>
      <Card name="Participants number">{participantsLength}</Card>
      {(participated && <Card name="This wallet is already a digger." />) || (
        <MerkleProof participants={participants} />
      )}
    </>
  );
};
