import { useEffect, useState } from "react";
import { Card } from "./card";
import { initialLeaves } from "../util/leaves";
import MerkleTree from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { useAddress, Web3Button } from "@thirdweb-dev/react";
import { MERKLE_ROPE } from "../util/web3";
import merkleRopeAbi from "../abi/merkleRope.abi.json";

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
  const [done, setDone] = useState(false);
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

    const tree = new MerkleTree(leaves, keccak256, MERKLE_TREE_OPTIONS);
    const leaf = keccak256(address);
    const proof = tree.getHexProof(leaf);
    setProof(proof);

    const newLeaves = leaves.filter(
      (leaf) => leaf.toLowerCase() !== address.toLowerCase()
    );
    console.log(newLeaves);
    const newTree = new MerkleTree(newLeaves, keccak256, MERKLE_TREE_OPTIONS);
    const newRoot = newTree.getHexRoot();
    setNewRoot(newRoot);
  }, [leaves, address]);

  const handleSuccess = () => {
    setDone(true);
  };

  return (
    <>
      <Card name="Get that rope longerrr!">
        <Web3Button
          onSuccess={handleSuccess}
          isDisabled={done}
          contractAddress={MERKLE_ROPE}
          contractAbi={merkleRopeAbi}
          action={(contract) => contract.call("dig", proof, newRoot)}
        >
          {done ? "Done" : "Dig dig dig"}
        </Web3Button>
      </Card>
      <Card name="Proof" mobileHidden>
        <pre className="text-left">{JSON.stringify(proof, null, 2)}</pre>
      </Card>
      <Card name="New Root" mobileHidden>
        <pre className="text-left">{newRoot}</pre>
      </Card>
    </>
  );
};
