import { ethers, providers } from "ethers";
import { useEffect, useState } from "react";
import { merkleRopeContract, provider, MERKLE_ROPE } from "../util/web3";
import { Card } from "./card";
import { initialLeaves } from "../util/leaves";
import MerkleTree from "merkletreejs";

export const Address = (): JSX.Element => {
  const [leaves, setLeaves] = useState<string[]>([]);
  const [participantsLength, setParticipantsLength] = useState<number | null>();
  const [proof, setProof] = useState<string[]>([]);
  const [newRoot, setNewRoot] = useState("");

  useEffect(() => {
    const PARTICIPANTS_STORAGE = "0x05";

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

        const participantsSet = new Set(participants);
        const leaves = initialLeaves.filter(
          (leaf) => !participantsSet.has(leaf)
        );

        setLeaves(leaves);
      } else {
        setLeaves(initialLeaves);
      }
    }
    getParticipants();
  }, []);

  useEffect(() => {
    if (leaves.length === 0) return;

    // const myAddress = "0x2902f1e23D4fAa1045c2a0a97b46EF5a5cfFB6ED";
    const myAddress = "0x0Fb095BB4a4E531AC1525F1C9Af9E224b12E5c72";

    const options = {
      hashLeaves: true,
      sortLeaves: false,
      sortPairs: true,
      duplicateOdd: false,
      isBitcoinTree: false,
    };

    const tree = new MerkleTree(leaves, ethers.utils.keccak256, options);
    const leaf = ethers.utils.keccak256(myAddress);
    const proof = tree.getHexProof(leaf);
    setProof(proof);

    const newLeaves = leaves.filter(
      (leaf) => leaf.toLowerCase() !== myAddress.toLowerCase()
    );
    console.log(newLeaves);
    const newTree = new MerkleTree(newLeaves, ethers.utils.keccak256, options);
    const newRoot = newTree.getHexRoot();
    setNewRoot(newRoot);
  }, [leaves]);

  return (
    <>
      <Card name="Participants number">
        {participantsLength}
        {/* <pre>{JSON.stringify(participantsLength, null, 2)}</pre> */}
      </Card>
      <Card name="Proof">
        <pre className="text-left">{JSON.stringify(proof, null, 2)}</pre>
      </Card>
      <Card name="New Root">
        <pre className="text-left">{newRoot}</pre>
      </Card>
    </>
  );
};
