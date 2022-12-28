import Document, { Html, Head, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";
import p from "../../../../package.json";

import type { ReactElement } from "react";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render(): ReactElement {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`/${p.splendid.adminDashboardPrefix}/favicon/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`/${p.splendid.adminDashboardPrefix}/favicon/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`/${p.splendid.adminDashboardPrefix}/favicon/favicon-16x16.png`}
          />
          <link
            rel="manifest"
            href={`/${p.splendid.adminDashboardPrefix}/favicon/site.webmanifest`}
          />
          <link
            rel="mask-icon"
            href={`/${p.splendid.adminDashboardPrefix}/favicon/safari-pinned-tab.svg`}
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#567e2d" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
