import { providers, Contract } from "ethers";
// import { Alchemy, Network } from "alchemy-sdk";
import merkleRopeAbi from "../abi/merkleRope.abi.json";

// export const alchemy = new Alchemy({
//   apiKey: "63-Ky27tDt4OWaRGfBrGUvHGzqXyI6Su",
//   network: Network.ETH_GOERLI,
// });

const API_KEY = "63-Ky27tDt4OWaRGfBrGUvHGzqXyI6Su";
// export const MERKLE_ROPE = "0x346e2881d080a5d67d1f4229ebaf926772300650";
export const MERKLE_ROPE = "0x55b36646b827cf1bbbeba7c5451a5c5f66862607";

export const provider = new providers.AlchemyProvider("goerli", API_KEY);

export const merkleRopeContract = new Contract(
  MERKLE_ROPE,
  merkleRopeAbi,
  provider
);
