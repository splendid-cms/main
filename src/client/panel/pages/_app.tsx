"use client";
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
  // This shouldn't be used in production!
  // Simple explanation:
  // Splendid uses Next.js as a frontend of the panel,
  // not as a backend.
  // In production it causes a problem with the server-side rendering of mantine.
  // As well as the problem with the cookies (can't return one).
  // You could use the method only in development mode (not for the client).
  // Therefore you should provide colorScheme variable into PanelProvider component taken from the property.
  // // // // // // // // // // // // // // //
  // static async getInitialProps(
  //   appContext: AppContext
  // ): Promise<AppInitialProps & { colorScheme: ColorScheme }> {
  //   const appProps: AppInitialProps = await App.getInitialProps(appContext);
  //   return {
  //     ...appProps,
  //     colorScheme: getCookie("color-scheme", appContext.ctx) as ColorScheme,
  //   };
  // }
  // // // // // // // // // // // // // // //

  render(): ReactElement {
    const { Component, pageProps }: AppInitialPropsWithLayout = this.props;
    // const colorScheme: ColorScheme = this.props?.colorScheme || getCookie("color-scheme") as ColorScheme;
    const colorScheme: ColorScheme = getCookie("color-scheme") as ColorScheme;

    // If getLayout is defined, use it e.g. auth/login.tsx
    const getLayout = Component.getLayout
      ? (page: ReactElement) => Component.getLayout(page)
      : (page: ReactElement) => (
          <PanelProvider colorScheme={colorScheme}>
            {page}
          </PanelProvider>
        );

    return getLayout(<Component {...pageProps} />);
  }
}
