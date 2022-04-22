import { ChartData } from "chart.js";
import { FunctionComponent } from "react";
import { Bar, Chart, Line } from "react-chartjs-2";
import { Section } from "../types/main";
import { getCourseLineChart, getGradesByProfessor } from "../util/data";

interface GradeChartProps {
  sections: Section[];
}

const GradeChart: FunctionComponent<GradeChartProps> = ({ sections }) => {
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    //scales: { xAxis: { type: "time" } },
    //legend: { position: "top" },
  };

  const data = getCourseLineChart(sections);
  // const data = getGradesByProfessor(sections);
  return (
    <div>
      <Line options={options as any} data={data as any} />
    </div>
  );
};

export default GradeChart;
