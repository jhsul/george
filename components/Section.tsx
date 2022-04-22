import Link from "next/link";
import { FunctionComponent } from "react";
import { Section } from "../types/main";
import { QUESTION_CATEGORIES } from "../util/data";
import Collapsible from "./Collapsible";
import Question from "./Question";
import QuestionComponent from "./Question";

interface SectionProps {
  section: Section;
}

const SectionComponent: FunctionComponent<SectionProps> = ({ section }) => {
  return (
    <div className="section-container">
      <div style={{ lineHeight: "80%" }}>
        <p>
          <b>Course:</b>{" "}
          <Link href={`/course/${section.courseId}`}>{section.courseName}</Link>
        </p>

        <p>
          <b>Professor:</b>{" "}
          <Link href={`/professor/${section.professorId}`}>
            {section.professorName}
          </Link>
        </p>
        <p className="">
          <b>Term:</b> {section.term}
        </p>
        <p className="">
          <b>Section Type:</b> {section.sectionType}
        </p>
      </div>

      {/* This is fucked */}
      {Object.keys(QUESTION_CATEGORIES).map((s) => (
        <Collapsible key={s} title={s}>
          {section.report
            .filter((q) => QUESTION_CATEGORIES[s].includes(q.questionNumber))
            .map((q) => (
              <Question key={q.questionNumber} question={q} />
            ))}
        </Collapsible>
      ))}
    </div>
  );
};

export default SectionComponent;
