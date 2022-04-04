import "../scss/globals.scss";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  );
};

export default App;
