import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement } from "react";

const App: NextPage<AppProps> = ({
  Component,
  pageProps,
}): ReactElement => {
  return <Component {...pageProps} />;
};

export default App;
