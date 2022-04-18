import { FunctionComponent } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import { v4 as uuidv4 } from "uuid";
import { Section } from "../types/main";
import SectionComponent from "./Section";

interface SectionProps {
  sections: Section[];
}

const Sections: FunctionComponent<SectionProps> = ({ sections }) => {
  return (
    <div>
      <Tabs>
        <TabList>
          {sections.map((s) => (
            <Tab key={uuidv4()}>{`${s.term.charAt(
              s.term.length - 1
            )} ${s.term.substring(0, 4)}`}</Tab>
          ))}
        </TabList>
        {sections.map((s) => (
          <TabPanel key={uuidv4()}>
            <SectionComponent section={s} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default Sections;
