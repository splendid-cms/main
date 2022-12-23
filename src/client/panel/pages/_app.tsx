import { PanelProvider } from "@component/layout";

import type { NextPage } from "next";
import App, { AppContext, AppInitialProps } from "next/app";
import { ReactElement } from "react";
import { ColorScheme } from "@mantine/core";
import { getCookie } from "cookies-next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppInitialPropsWithLayout = AppInitialProps & {
  Component: NextPageWithLayout;
  colorScheme: ColorScheme;
};

export default class Panel extends App<AppInitialPropsWithLayout> {
  static async getInitialProps(
    appContext: AppContext
  ): Promise<AppInitialProps & { colorScheme: ColorScheme }> {
    const appProps: AppInitialProps = await App.getInitialProps(appContext);

    return {
      ...appProps,
      colorScheme: getCookie("color-scheme", appContext.ctx) as ColorScheme,
    };
  }

  render(): ReactElement {
    const { Component, pageProps, colorScheme }: AppInitialPropsWithLayout =
      this.props;
    const getLayout = Component.getLayout
      ? (page) => Component.getLayout(page)
      : (page) => (
          <PanelProvider colorScheme={colorScheme}>{page}</PanelProvider>
        );

    return getLayout(<Component {...pageProps} />);
  }
}
