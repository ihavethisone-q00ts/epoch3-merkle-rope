import type { NextPage } from "next";
import Head from "next/head";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Address } from "../components/address";

const Home: NextPage = () => {
  const address = useAddress();

  return (
    <>
      <Head>
        <title>Merkle Rope Solver</title>
        <meta name="description" content="q00nicorns FTW!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="flex justify-end">
        <ConnectWallet />
      </nav>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Merkle Rope Solver
        </h1>
        <div className="mt-3 grid gap-3 pt-3">
          <Address />
        </div>
      </main>
    </>
  );
};

export default Home;
