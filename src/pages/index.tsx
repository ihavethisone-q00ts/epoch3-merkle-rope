import type { NextPage } from "next";
import Head from "next/head";
import { Address } from "../components/address";
import { CurrentRoot } from "../components/currentRoot";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Merkle Rope Solver</title>
        <meta name="description" content="q00nicorns FTW!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Merkle Rope Solver
        </h1>
        <div className="mt-3 gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
          <CurrentRoot />
          <Address />
        </div>
      </main>
    </>
  );
};

export default Home;
