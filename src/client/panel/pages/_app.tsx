import { PanelProvider } from "components/layout";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { ColorScheme } from "@mantine/core";
import { getCookie } from "cookies-next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: NextPage<AppPropsWithLayout & { colorScheme: ColorScheme }> = ({
  Component,
  pageProps,
}): ReactElement => {
  const getLayout = Component.getLayout
    ? (page) => Component.getLayout(page)
    : (page) => <PanelProvider>{page}</PanelProvider>;

  return getLayout(<Component {...pageProps} />);
};

App.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    colorScheme: (getCookie("color-scheme") as ColorScheme) || "light",
  };
};

export default App;
