import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import SectionComponent from "../../components/Section";
import { Professor, Section } from "../../types/main";
import { getDb } from "../../util/db";

interface ProfessorPageProps {
  professor: Professor;
  sections: Section[];
}

const Professor: NextPage<ProfessorPageProps> = ({ professor, sections }) => {
  return (
    <div>
      <h1 className="display-1">{professor.name}</h1>
      <p>{JSON.stringify(professor, null, 2)}</p>
      <b>Sections</b>
      <p>{JSON.stringify(sections, null, 2)}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _id = context.params?.professorId;
  console.log(_id);
  if (!_id) {
    return { notFound: true };
  }
  const db = await getDb();

  const professorRes = (await db
    .collection("professors")
    .findOne({ _id })) as any;

  if (!professorRes) return { notFound: true };
  delete professorRes.sections;

  const professor = professorRes as Professor;

  const sectionsRes = (await db
    .collection("sections")
    .find({ professorId: _id })
    .toArray()) as any[];

  if (!sectionsRes) return { notFound: true };

  for (const s of sectionsRes) delete s._id;

  const sections = sectionsRes as Section[];

  return { props: { professor, sections } };
};
export default Professor;
