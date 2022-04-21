import { FunctionComponent } from "react";
import { Section } from "../types/main";
import { QUESTION_CATEGORIES } from "../util/data";
import QuestionComponent from "./Question";
import QuestionCategory from "./QuestionCategory";

interface SectionProps {
  section: Section;
}

const SectionComponent: FunctionComponent<SectionProps> = ({ section }) => {
  return (
    <div className="section-container">
      <div style={{ lineHeight: "80%" }}>
        <p>
          <b>Course:</b> {section.courseName}
        </p>

        <p className="">
          <b>Professor:</b> {section.professorName}
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
        <QuestionCategory
          key={s}
          category={s}
          questions={section.report.filter((q) =>
            QUESTION_CATEGORIES[s].includes(q.questionNumber)
          )}
        />
      ))}
    </div>
  );
};

export default SectionComponent;
