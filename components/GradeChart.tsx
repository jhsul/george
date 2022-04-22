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
    maintainAspectRatio: true,
    showScale: false,
    responsive: true,
    //plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0,
        max: 3,
        padding: 10,
        ticks: {
          callback: (value: number, index: number, ticks: number) => {
            return value === 3
              ? "A"
              : value === 2
              ? "B"
              : value === 1
              ? "C"
              : value === 0
              ? "NR"
              : value;
          },
          maxTicksLimit: 4,
        },
      },
    },
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
