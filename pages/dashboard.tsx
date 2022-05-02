import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import Page from "../components/Page";
import { Course, Section } from "../types/main";
import { getAggregatedCourses, QUESTION_CATEGORIES } from "../util/data";
import { getDb } from "../util/db";

interface DashboardProps {
  departments: string[];
  aggregatedCourses: Course[];
}

const Dashboard: NextPage<DashboardProps> = ({
  aggregatedCourses,
  departments,
}) => {
  const [department, setDepartment] = useState<string>("all");
  const [isDecreasing, setIsDecreasing] = useState<boolean>(true);
  const [filterBy, setFilterBy] = useState<string>(
    Object.keys(QUESTION_CATEGORIES)[0]
  );
  const [courses, setCourses] = useState<Course[]>(aggregatedCourses);

  // SHould probably use a reducer here but idc it's simple enough
  useEffect(() => {
    console.log(
      `Looking at ${department} by ${filterBy} in ${
        isDecreasing ? "decreasing" : "increasing"
      } order`
    );
    const filteredCourses =
      department === "all"
        ? [...aggregatedCourses]
        : aggregatedCourses.filter((c) => c._id.split(" ")[0] === department);

    filteredCourses.sort((a, b) => {
      //onsole.log(diff);

      return (
        (b.aggregatedData![filterBy] > a.aggregatedData![filterBy] ? 1 : -1) *
        (isDecreasing ? 1 : -1)
      );
    });

    console.log(filteredCourses);

    setCourses(filteredCourses);
  }, [department, filterBy, isDecreasing]);
  //console.log(aggregatedCourses);
  return (
    <>
      <Page title={"Dashboard"}>
        <div>
          Department:{" "}
          <select
            className="form-select"
            onChange={(e) => setDepartment(e.currentTarget.value)}
          >
            <option value="all">All</option>
            {departments.map((d) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          Sort by:{" "}
          <select
            className="form-select"
            onChange={(e) => setFilterBy(e.currentTarget.value)}
          >
            {Object.keys(QUESTION_CATEGORIES).map((q) => (
              <option value={q} key={q}>
                {q}
              </option>
            ))}
          </select>
          Decreasing:
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => setIsDecreasing(e.currentTarget.checked)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Sections</th>
              {Object.keys(QUESTION_CATEGORIES).map((q) => (
                <th key={q}>{q}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>
                  <Link href={`/course/${c._id}`}>{c._id}</Link>
                </td>
                <td>
                  <Link href={`/course/${c._id}`}>{c.name}</Link>
                </td>
                <td>{c.aggregatedSections}</td>
                {Object.keys(QUESTION_CATEGORIES).map((q) => {
                  const tdValue = c.aggregatedData
                    ? c.aggregatedData[q]
                      ? c.aggregatedData[q].toFixed(2)
                      : "NAN"
                    : "Bad";
                  return <td key={c + q}>{tdValue}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    </>
  );
};
/*
..Object.keys(QUESTION_CATEGORIES).map((q) => (
                <td>{c.aggregatedData![q]}</td>
                */

// REPLACE WITH STATIC PROPS EVENTUALLY!!!!!!!!!!
export const getStaticProps: GetStaticProps = async (context) => {
  const db = await getDb();
  const sections = (await db
    .collection("sections")
    .find({})
    .toArray()) as any[];

  const departments: string[] = [];

  for (const section of sections) {
    delete section._id;
    const department = section.courseId.toString().split(" ")[0];
    if (!departments.includes(department)) {
      departments.push(department);
    }
  }
  departments.sort();

  const aggregatedCourses = getAggregatedCourses(sections);
  return { props: { departments, aggregatedCourses } };
};

export default Dashboard;
