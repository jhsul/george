import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import SectionComponent from "../../components/Section";
import Sections from "../../components/Sections";
import { Course, Professor, Section } from "../../types/main";
import { getDb } from "../../util/db";

interface CoursePageProps {
  course: Course;
  sections: Section[];
}

const Course: NextPage<CoursePageProps> = ({ course, sections }) => {
  return (
    <div>
      <h1 className="display-1">{course.name}</h1>
      <p>{JSON.stringify(course, null, 2)}</p>
      <b>Sections</b>
      <Sections sections={sections} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _id = context.params?.courseId;
  console.log(_id);
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
