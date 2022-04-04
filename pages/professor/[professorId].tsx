import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import SectionComponent from "../../components/Section";
import { Professor, Section } from "../../types/main";
import { getDb } from "../../util/db";

interface ProfessorParams extends ParsedUrlQuery {
  professorId: string;
}

interface ProfessorPageProps {
  professor: Professor;
  sections: Section[];
}

const Professor: NextPage<ProfessorPageProps> = ({ professor, sections }) => {
  return (
    <div>
      <h1 className="display-1">{professor.name}</h1>
      <p>
        <b>Active years: </b>
        {professor.activeYears}
      </p>
      {sections.map((section, idx) => (
        <SectionComponent key={idx} section={section} />
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context);
  const { professorId } = context.params!;
  const db = await getDb();

  const professor = await db
    .collection("professors")
    .findOne({ _id: professorId });

  if (!professor) return { props: {}, notFound: true };

  const sections = (await db
    .collection("sections")
    .find({ _id: { $in: professor.sections } })
    .toArray()) as any[];

  delete professor.sections;
  sections.forEach((s) => (s._id = s._id.toHexString()));

  console.log(professor);
  console.log(sections);
  return { props: { professor, sections } };
};

export const getStaticPaths: GetStaticPaths<ProfessorParams> = async () => {
  const ids = ["938547"]; // actually get a full list from mongo

  const paths = ids.map((id) => ({ params: { professorId: id } }));

  return {
    paths,
    fallback: false,
  };
};

export default Professor;
