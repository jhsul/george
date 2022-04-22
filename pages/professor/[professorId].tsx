import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Page from "../../components/Page";
import SectionComponent from "../../components/Section";
import { Professor, Section } from "../../types/main";
import {
  courseGetSectionTitle,
  professorGetSectionTitle,
} from "../../util/data";
import { getDb } from "../../util/db";
import { v4 as uuidv4 } from "uuid";

interface ProfessorPageProps {
  professor: Professor;
  sections: Section[];
}

const Professor: NextPage<ProfessorPageProps> = ({ professor, sections }) => {
  return (
    <Page title={professor.name}>
      <h6>Full Professor History</h6>
      <Tabs>
        <TabList>
          {sections.map((s) => (
            <Tab key={uuidv4()}>{professorGetSectionTitle(s)}</Tab>
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
