import { useEffect, useState } from "react";
import { Card } from "./card";
import { initialLeaves } from "../util/leaves";
import MerkleTree from "merkletreejs";
import { ethers } from "ethers";

type MerkleProofProps = {
  participants: string[];
};

const MERKLE_TREE_OPTIONS = {
  hashLeaves: true,
  sortLeaves: false,
  sortPairs: true,
  duplicateOdd: false,
  isBitcoinTree: false,
};

export const MerkleProof = ({
  participants,
}: MerkleProofProps): JSX.Element => {
  const [leaves, setLeaves] = useState<string[]>([]);
  const [proof, setProof] = useState<string[]>([]);
  const [newRoot, setNewRoot] = useState("");

  useEffect(() => {
    const participantsSet = new Set(participants);
    const leaves = initialLeaves.filter((leaf) => !participantsSet.has(leaf));

    setLeaves(leaves);
  }, [participants]);

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
      <Card name="Proof">
        <pre className="text-left">{JSON.stringify(proof, null, 2)}</pre>
      </Card>
      <Card name="New Root">
        <pre className="text-left">{newRoot}</pre>
      </Card>
    </>
  );
};
