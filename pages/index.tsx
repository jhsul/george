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
import { getDb } from "../util/db";

import _ from "lodash";

import wpiLogo from "../public/wpi_logo.png";

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
    <div>
      <div className="search-container">
        <div className="search">
          <p className="lead">Browse WPI student course reports</p>
          <div className="hbox mb-4">
            <Image src={wpiLogo} className="mr-auto" />
            <div className="vr mx-4 "></div>
            <div className="vbox logo">
              <div style={{ flex: 1 }}></div>
              <p className="logo-text">
                <b>G</b>ompei&aposs
              </p>
              <p className="logo-text">
                <b>E</b>ternal
              </p>
              <p className="logo-text">
                <b>O</b>nline hub for
              </p>
              <p className="logo-text">
                <b>R</b>reports
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

          <div className="input-group" style={{ position: "relative" }}>
            <input
              type="text"
              className="form-control"
              placeholder="george"
              onChange={onSearchChange}
            />

            <div className="suggestions-box">
              {searchResults.map((r) => (
                <Suggestion key={r._id} results={r} />
              ))}
            </div>
          </div>

          <a href="https://github.com/jhsul/george">
            view the source on github
          </a>
        </div>
      </div>
    </div>
  );
};

const Suggestion: FunctionComponent<{ results: SearchResult }> = ({
  results,
}) => {
  return (
    <div className="suggestion">
      <div className="hbox">
        <div className="vbox">
          <b>{results.type}</b>
          <p>{results.name}</p>
        </div>
        <div style={{ flex: 1 }}></div>
        <div>{results.score.toFixed(2)}</div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log("Getting data for frontpage search");
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
