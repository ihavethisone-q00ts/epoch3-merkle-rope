import { providers, Contract } from "ethers";
import merkleRopeAbi from "../abi/merkleRope.abi.json";

const API_KEY = process.env.API_KEY;
// export const MERKLE_ROPE = "0x346e2881d080a5d67d1f4229ebaf926772300650";
export const MERKLE_ROPE = "0x55b36646b827cf1bbbeba7c5451a5c5f66862607";

export const provider = new providers.AlchemyProvider("goerli", API_KEY);

export const merkleRopeContract = new Contract(
  MERKLE_ROPE,
  merkleRopeAbi,
  provider
);
