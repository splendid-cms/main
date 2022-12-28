import { useStyles } from "./styles";
import Image from "next/image";

import type { FooterProps, Link as LinkType, Styling } from "./types";
import type { FunctionComponent, ReactElement } from "react";

import { Container, Group } from "@mantine/core";

import PlatformBlack from "@public/splendid-colored.svg";
import { footerLicense } from "./config";

/**
 * Footer component that is used in the AppShell (see: components/layout/component.tsx)
 * @returns {ReactElement} Responsible div element with given options.
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app Next.js Custom App}
 * @see {@link https://mantine.dev/core/getting-started/ Mantine Core}
 * @see {@link https://mantine.dev/core/app-shell/ AppShell}
 * @example
 * <Footer />
 **/
export const Footer: FunctionComponent = (): ReactElement => {
  const { classes }: Styling = useStyles();

  return (
    <div className={classes.footer}>
      <div className={classes.wrapper}>
        <Container className={classes.inner}>
          <Image src={PlatformBlack} alt="Platform" height={30} width={30} />
          <Group className={classes.info}>{footerLicense}</Group>
        </Container>
      </div>
    </div>
  );
};
