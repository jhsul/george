import { FunctionComponent } from "react";
import { Section } from "../types/main";
import { QUESTION_CATEGORIES } from "../util/data";

interface AggregatedSections {
  groupBy: "professors" | "courses";
  sections: Section[];
}

const AggregatedSections: FunctionComponent<AggregatedSections> = ({
  sections,
  groupBy,
}) => {
  return <div>{`${sections.length} sections grouped by ${groupBy}`}</div>;
};

export default AggregatedSections;
