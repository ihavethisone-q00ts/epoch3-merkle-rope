import { ethers, providers } from "ethers";
import { useEffect, useState } from "react";
import { merkleRopeContract, provider, MERKLE_ROPE } from "../util/web3";
import { Card } from "./card";
import { initialLeaves } from "../util/leaves";
import MerkleTree from "merkletreejs";

type ParticipantsProps = {
  address: string;
};

const PARTICIPANTS_STORAGE = "0x05";

const MERKLE_TREE_OPTIONS = {
  hashLeaves: true,
  sortLeaves: false,
  sortPairs: true,
  duplicateOdd: false,
  isBitcoinTree: false,
};

export const Participants = ({ address }: ParticipantsProps): JSX.Element => {
  const [leaves, setLeaves] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [participated, setParticipated] = useState(false);
  const [participantsLength, setParticipantsLength] = useState<number | null>();
  const [proof, setProof] = useState<string[]>([]);
  const [newRoot, setNewRoot] = useState("");

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
    }

    getParticipants();
  }, []);

  useEffect(() => {
    const participantsSet = new Set(participants);
    const leaves = initialLeaves.filter((leaf) => !participantsSet.has(leaf));

    setLeaves(leaves);
  }, [participants]);

  useEffect(() => {
    const participantsSet = new Set(participants);
    if (participantsSet.has(address)) {
      setParticipated(true);
    }
  }, [participants, address]);

  useEffect(() => {
    if (leaves.length === 0) return;

    // const myAddress = "0x2902f1e23D4fAa1045c2a0a97b46EF5a5cfFB6ED";
    const myAddress = "0x0Fb095BB4a4E531AC1525F1C9Af9E224b12E5c72";

    const tree = new MerkleTree(
      leaves,
      ethers.utils.keccak256,
      MERKLE_TREE_OPTIONS
    );
    const leaf = ethers.utils.keccak256(myAddress);
    const proof = tree.getHexProof(leaf);
    setProof(proof);

    const newLeaves = leaves.filter(
      (leaf) => leaf.toLowerCase() !== myAddress.toLowerCase()
    );
    console.log(newLeaves);
    const newTree = new MerkleTree(
      newLeaves,
      ethers.utils.keccak256,
      MERKLE_TREE_OPTIONS
    );
    const newRoot = newTree.getHexRoot();
    setNewRoot(newRoot);
  }, [leaves]);

  return (
    <>
      <Card name="Participants number">{participantsLength}</Card>
      {(participated && <Card name="This wallet is already a digger." />) || (
        <>
          <Card name="Proof">
            <pre className="text-left">{JSON.stringify(proof, null, 2)}</pre>
          </Card>
          <Card name="New Root">
            <pre className="text-left">{newRoot}</pre>
          </Card>
        </>
      )}
    </>
  );
};
