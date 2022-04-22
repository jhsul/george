import "../scss/globals.scss";
import "react-tabs/style/react-tabs.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import {
  BoxAndWiskers as BoxAndWhiskers,
  BoxPlotController,
} from "@sgratzl/chartjs-chart-boxplot";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWhiskers
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>GEORGE</title>
        <meta name="description" content="Browse WPI student course reports" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
