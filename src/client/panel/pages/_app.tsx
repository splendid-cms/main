import { MantineProvider } from "@mantine/core";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement } from "react";

const App: NextPage<AppProps> = ({
  Component,
  pageProps,
}): ReactElement => {
  return (
    <MantineProvider
      theme={{
        primaryColor: "teal",
        globalStyles: () => ({
          body: {
            padding: 0,
            margin: 0
          }
        })
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
