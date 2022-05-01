import { Agent } from "http";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from "react";

import { Course, Professor, SearchResult } from "../types/main";

import _ from "lodash";

import wpiLogo from "../public/wpi_logo.png";
import { useRouter } from "next/router";
import Link from "next/link";

interface HomeProps {
  professors: Professor[];
  courses: Course[];
}

const Home: NextPage<HomeProps> = ({ professors, courses }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    console.log("Loaded frontpage 😀");
  }, []);

  const onSearchChange: ChangeEventHandler = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const text = event.currentTarget.value;

    if (text.length <= 0) {
      setSearchResults([]);
      return;
    }

    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.status !== 200) {
      console.error("Error searching");
      setSearchResults([]);
      return;
    }

    setSearchResults((await res.json()) as any[] as SearchResult[]);
    //const res = await fetch("http")
  };
  return (
    <div className="search-container">
      <div className="search">
        <p className="lead">Browse WPI student course reports</p>
        <div className="hbox mb-4">
          <Image
            src={wpiLogo}
            className="mr-auto"
            style={{ flex: 1, aspectRatio: "1" }}
          />
          <div className="vr mx-4 "></div>
          <div className="vbox logo">
            <div style={{ flex: 1 }}></div>
            <p className="logo-text">
              <b>G</b>
              {"ompei's"}
            </p>
            <p className="logo-text">
              <b>E</b>ternal
            </p>
            <p className="logo-text">
              <b>O</b>nline hub for
            </p>
            <p className="logo-text">
              <b>R</b>eports
            </p>
            <p className="logo-text">
              <b>G</b>rades
            </p>
            <p className="logo-text">
              <b>E</b>t cetera
            </p>
            <div style={{ flex: 1 }}></div>
          </div>
        </div>
        <p>
          Search professors/courses or view the{" "}
          <Link href="/dashboard">dashboard</Link>
        </p>
        <div className="input-group" style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="george"
            onChange={onSearchChange}
          />

          <div className="suggestions-box">
            {searchResults.map((r) => (
              <Suggestion key={r._id} result={r} />
            ))}
          </div>
        </div>
        <hr />
        <a href="https://github.com/jhsul/george">source code</a>
      </div>
      <div style={{ flexGrow: 1 }}></div>
    </div>
  );
};

const Suggestion: FunctionComponent<{ result: SearchResult }> = ({
  result,
}) => {
  const router = useRouter();

  const suggestionClick = () => {
    console.log(result);
    router.push(`/${result.type}/${result._id}`);
  };

  return (
    <div className="suggestion" onClick={suggestionClick}>
      <div className="hbox" style={{ alignItems: "center" }}>
        <div>{result.name}</div>
        <div style={{ flex: 1 }}></div>
        <div>{result.type === "professor" ? "👨‍🎓" : "📚"}</div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  //console.log("Getting data for frontpage search");
  /*
  const db = await getDb();

  const professors = (await db
    .collection("professors")
    .find({}, {})
    .toArray()) as any[] as Professor[];

  const courses = (await db
    .collection("courses")
    .find()
    .toArray()) as any[] as Course[];

  // Remove the "sections element from the props"
  for (const o of [...professors, ...courses]) {
    //@ts-ignore
    delete o.sections;

    //@ts-ignore
    delete o.activeYears;
  }
  //console.table(professors);
*/
  return {
    props: {
      professors: [],
      courses: [],
    },
  };
};

export default Home;
