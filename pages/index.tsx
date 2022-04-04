import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Nav from "../components/Nav";
import Search from "../components/Search";

const Home: NextPage = () => {
  return (
    <div>
      <Search />
    </div>
  );
};

export default Home;
