import { useEffect, useState } from "react";
import { Card } from "./card";
import { initialLeaves } from "../util/leaves";
import MerkleTree from "merkletreejs";
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";

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
  const address = useAddress();
  const [leaves, setLeaves] = useState<string[]>([]);
  const [proof, setProof] = useState<string[]>([]);
  const [newRoot, setNewRoot] = useState("");

  useEffect(() => {
    const participantsSet = new Set(participants);
    const leaves = initialLeaves.filter((leaf) => !participantsSet.has(leaf));

    setLeaves(leaves);
  }, [participants]);

  useEffect(() => {
    if (!address) return;
    if (leaves.length === 0) return;

    const tree = new MerkleTree(
      leaves,
      ethers.utils.keccak256,
      MERKLE_TREE_OPTIONS
    );
    const leaf = ethers.utils.keccak256(address);
    const proof = tree.getHexProof(leaf);
    setProof(proof);

    const newLeaves = leaves.filter(
      (leaf) => leaf.toLowerCase() !== address.toLowerCase()
    );
    console.log(newLeaves);
    const newTree = new MerkleTree(
      newLeaves,
      ethers.utils.keccak256,
      MERKLE_TREE_OPTIONS
    );
    const newRoot = newTree.getHexRoot();
    setNewRoot(newRoot);
  }, [leaves, address]);

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
