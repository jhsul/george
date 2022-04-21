import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import Page from "../../components/Page";
import SectionComponent from "../../components/Section";
import SectionGroup from "../../components/SectionGroup";
import { Course, Professor, Section } from "../../types/main";
import { getDb } from "../../util/db";

interface CoursePageProps {
  course: Course;
  sections: Section[];
}

const Course: NextPage<CoursePageProps> = ({ course, sections }) => {
  useEffect(() => {
    console.log(`Loaded ${course.name} 📚`);
  }, []);
  return (
    <Page title={course.name}>
      <p>{course._id} has been taught _ times by _ different professors</p>
      <h6>Sections</h6>
      <SectionGroup sections={sections} groupBy="professors" />
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
