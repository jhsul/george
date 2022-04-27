import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { useEffect } from "react";
import Page from "../../components/Page";
import SectionComponent from "../../components/Section";
import { Course, Professor, Section } from "../../types/main";
import { getDb } from "../../util/db";
import { v4 as uuidv4 } from "uuid";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import GradeChart from "../../components/GradeChart";
import { courseGetSectionTitle } from "../../util/data";

interface CoursePageProps {
  course: Course;
  sections: Section[];
}

const professorCount = (sections: Section[]) => {
  const professorList: string[] = [];
  for (const section of sections) {
    if (!professorList.includes(section.professorId)) {
      professorList.push(section.professorId);
    }
  }
  return professorList.length;
};

const Course: NextPage<CoursePageProps> = ({ course, sections }) => {
  useEffect(() => {
    console.log(`Loaded ${course.name} 📚`);
  }, []);
  return (
    <Page title={course.name}>
      <p>
        {course._id} has been taught {sections.length} times by{" "}
        {professorCount(sections)} different professors
      </p>
      <h6>Average Grade by Professor</h6>
      <GradeChart sections={sections} />
      <h6>Full Course History</h6>
      <Tabs>
        <TabList>
          {sections.map((s) => (
            <Tab key={uuidv4()}>{courseGetSectionTitle(s)}</Tab>
          ))}
        </TabList>

        {sections.map((s) => (
          <TabPanel key={uuidv4()}>
            <SectionComponent section={s} />
          </TabPanel>
        ))}
      </Tabs>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _id = context.params?.courseId;

  if (!_id) {
    return { notFound: true };
  }
  const db = await getDb();

  const courseRes = (await db.collection("courses").findOne({ _id })) as any;

  if (!courseRes) return { notFound: true };
  delete courseRes.sections;

  const course = courseRes as Course;

  const sectionsRes = (await db
    .collection("sections")
    .find({ courseId: _id })
    .toArray()) as any[];

  if (!sectionsRes) return { notFound: true };

  for (const s of sectionsRes) delete s._id;

  const sections = sectionsRes as Section[];

  return { props: { course, sections } };
};
export default Course;
