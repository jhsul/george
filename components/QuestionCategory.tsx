import { FunctionComponent, useState } from "react";

import { Question } from "../types/main";
import QuestionComponent from "./Question";

interface QuestionCategoryProps {
  category: string;
  questions: Question[];
}

const QuestionCategory: FunctionComponent<QuestionCategoryProps> = ({
  category,
  questions,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  return (
    <div>
      <hr />
      <h6
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIsCollapsed((s) => !s);
        }}
      >
        {isCollapsed ? "+ " : "- "}
        {category}
      </h6>
      {!isCollapsed && (
        <div className="questions-container">
          {questions.map((q) => (
            <QuestionComponent key={q.questionNumber} question={q} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionCategory;
