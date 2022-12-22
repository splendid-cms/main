import { useDisclosure } from "@mantine/hooks";
import { useStyles } from "./styles";
import Image from "next/image";

import { FunctionComponent, ReactElement, useState } from "react";
import type { Link as LinkT, Styling } from "./types";

import {
  Container,
  Group,
  Burger,
  Title,
  Drawer,
  UnstyledButton,
  Flex,
  Stack,
  useMantineColorScheme
} from "@mantine/core";

import SplendidLogo from "@public/splendid-colored.svg";
import { navLinks } from "./config";
import { useRouter } from "next/router";
import Link from "next/link";

/**
 * Header component that is used in the AppShell (see: src/pages/_app.tsx)
 * @returns {ReactElement} Responsible div element with given options.
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app Next.js Custom App}
 * @see {@link https://nextjs.org/docs/api-reference/next/router Next.js Router}
 * @see {@link https://mantine.dev/core/getting-started/ Mantine Core}
 * @example
 * <Header
 *     tabs={[
 *         {
 *             label: "Home",
 *             href: "/"
 *         },
 *         {
 *             label: "About Us",
 *             href: "/about"
 *         }
 *     ]}
 * />
 **/
export const Header: FunctionComponent = (): ReactElement => {
  const { classes, cx }: Styling = useStyles();
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();
  const [active, setActive] = useState(
    navLinks.find((link: LinkT) =>
      link.sublinks.some((sub) => sub.href === router.pathname)
    ) ?? navLinks[0]
  );
  const [activeLink, setActiveLink] = useState(
    active.sublinks.find((link) => link.href === router.pathname) ??
      active.sublinks[0]
  );

  const mainLinks = navLinks.map((link: LinkT) => (
    <UnstyledButton
      onClick={() => setActive(link)}
      key={link.label}
      className={cx(classes.mainLink, {
        [classes.mainLinkActive]: link.label === active.label,
      })}
    >
      <link.icon stroke={2} />
    </UnstyledButton>
  ));

  const links = navLinks
    .find((link) => link.label === active.label)
    .sublinks.map((link) => (
      <Link
        className={cx(classes.link, {
          [classes.linkActive]: activeLink === link,
        })}
        href={link.href}
        onClick={() => {
          setActiveLink(link);
          close();
        }}
        key={link.label}
      >
        {link.label}
      </Link>
    ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Title order={3} className={classes.title}>
            <Image
              src={SplendidLogo}
              alt="Splendid"
              height={28}
              width={28}
              style={{ marginRight: 12 }}
            />
            {active.label}
          </Title>

          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
          />
        </Group>
        <Drawer
          opened={opened}
          className={classes.drawer}
          onClose={toggle}
          transition="slide-right"
          position="left"
          title={(
            <Title order={4}>
              {active.label}
            </Title>
          )}
          padding="md"
        >
          <Flex>
            <Stack spacing={0}>
              {mainLinks}
            </Stack>
            <Stack spacing={0} style={{ width: "100%" }}>
              {links}
            </Stack>
          </Flex>
        </Drawer>
      </Container>
    </div>
  );
};
