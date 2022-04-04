import { FunctionComponent } from "react";
import { Section } from "../types/main";

interface SectionProps {
  section: Section;
}

const SectionComponent: FunctionComponent<SectionProps> = ({ section }) => {
  return (
    <div>
      <h5>
        {section.courseId}: {section.courseName}
      </h5>
      <p>
        <b>Professor: </b> {section.professorName}
      </p>
      <p>
        <b>Type: </b> {section.sectionType}
      </p>
      <p>
        <b>Term: </b> {section.term}
      </p>
    </div>
  );
};

export default SectionComponent;
