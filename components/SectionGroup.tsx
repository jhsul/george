import { FunctionComponent } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import { v4 as uuidv4 } from "uuid";
import { Section } from "../types/main";
import AggregatedSections from "./AggregatedSections";
import SectionComponent from "./Section";

interface SectionGroupProps {
  sections: Section[];
  groupBy: "courses" | "professors";
}

const SectionGroup: FunctionComponent<SectionGroupProps> = ({
  sections,
  groupBy,
}) => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>All</Tab>
          {sections.map((s) => (
            <Tab key={uuidv4()}>{`${s.term.charAt(
              s.term.length - 1
            )} ${s.term.substring(0, 4)}`}</Tab>
          ))}
        </TabList>
        <TabPanel>
          <AggregatedSections sections={sections} groupBy={groupBy} />
        </TabPanel>
        {sections.map((s) => (
          <TabPanel key={uuidv4()}>
            <SectionComponent section={s} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default SectionGroup;
