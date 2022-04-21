import { FunctionComponent } from "react";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Question } from "../types/main";

interface QuestionProps {
  question: Question;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QUESTION_TEXTS: { [key: number]: string } = {
  1: "My overall rating of the quality of this course is",
  2: "My overall rating of the instructor's teaching is",
  3: "The educational value of the assigned work was",
  4: "The instructor's organization of the course was",
  5: "The instructor's clarity in communicating course objectives was",
  6: "The instructor's skill in providing understandable explanations was",
  7: "The amount I learned from the course was",
  8: "The intellectual challenge presented by the course was",
  9: "The instructor's personal interest in helping students learn was",
  10: "The instructor stimulated my interest in the subject matter",
  11: "The amount of reading, homework, and other assigned work was",
  12: "The instructor was well prepared to teach class.",
  13: "The instructor encouraged students to ask questions.",
  14: "The instructor treated students with respect.",
  15: "Instructor feedback on exams/assignments was timely and helpful.",
  16: "The exams and/or evaluations were good measures of the material covered.",
  17: "My grades were determined in a fair and impartial manner.",
  18: "What grade do you think you will receive in this course?",
  19: "On average, what were the total hours spent in each 7-day week OUTSIDE of formally scheduled class time in work related to this course (including studying, reading, writing, homework, rehearsal, etc.)?",
};

const QuestionComponent: FunctionComponent<QuestionProps> = ({ question }) => {
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const labels =
    question.questionNumber === 18
      ? ["A", "B", "C", "NR", "Not sure"]
      : [1, 2, 3, 4, 5];

  const data = {
    labels,
    datasets: [{ label: "Student responses", data: question.responses }],
  };

  return (
    <div className="question">
      <p>{QUESTION_TEXTS[question.questionNumber]}</p>
      <Bar
        options={options}
        data={data as ChartData<"bar", number[], unknown>}
      />
    </div>
  );
};

export default QuestionComponent;
