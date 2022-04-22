import { ChartData } from "chart.js";
import { FunctionComponent, useEffect } from "react";

import { Bar, Chart } from "react-chartjs-2";
import { Question } from "../types/main";
import { COLOR_PALETTE, QUESTION_TEXTS } from "../util/data";

interface QuestionProps {
  question: Question;
}

const QuestionComponent: FunctionComponent<QuestionProps> = ({ question }) => {
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const labels =
    question.questionNumber === 18
      ? ["A", "B", "C", "NR", "Not sure"]
      : ["1", "2", "3", "4", "5"];

  const data = {
    labels,
    datasets: [
      {
        label: "Student responses",
        data: question.responses as number[],
        backgroundColor: COLOR_PALETTE[0],
      },
    ],
  };

  useEffect(() => {
    //console.log(question.questionNumber);
    // console.log(question.responses);
  }, []);

  return (
    <div className="question">
      <p>{QUESTION_TEXTS[question.questionNumber]}</p>
      <Bar options={options} data={data} />
    </div>
  );
};

export default QuestionComponent;
