import "../scss/globals.scss";
import "react-tabs/style/react-tabs.css";

import type { AppProps } from "next/app";
import Head from "next/head";

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
