import { FunctionComponent } from "react";
import { Section } from "../types/main";
import QuestionComponent from "./Question";

interface SectionProps {
  section: Section;
}

const COURSE_QUALITY = [1, 2, 3, 4, 5, 6];
const COURSE_DIFFICULTY = [7, 8, 9, 10, 11, 19];
const INSTRUCTOR_QUALITY = [12, 13, 14, 15, 16];

const SectionComponent: FunctionComponent<SectionProps> = ({ section }) => {
  return (
    <div className="section-container">
      <p className="">
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

      <hr />
      <b>Course Quality</b>
      <div className="questions-container">
        {COURSE_QUALITY.map((i) => (
          <QuestionComponent key={i} question={section.report[i - 1]} />
        ))}
      </div>

      <hr />
      <b>Course Difficulty</b>
      <div className="questions-container">
        {COURSE_DIFFICULTY.map((i) => (
          <QuestionComponent key={i} question={section.report[i - 1]} />
        ))}
      </div>

      <hr />
      <b>Instructor Quality</b>
      <div className="questions-container">
        {INSTRUCTOR_QUALITY.map((i) => (
          <QuestionComponent key={i} question={section.report[i - 1]} />
        ))}
      </div>
    </div>
  );
};

export default SectionComponent;
