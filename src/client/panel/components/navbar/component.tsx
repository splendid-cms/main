import { FunctionComponent, ReactElement, useState } from "react";
import {
  Navbar as MantineNavbar,
  UnstyledButton,
  Tooltip,
  Title,
  useMantineColorScheme,
  ActionIcon,
  Paper,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStyles } from "./styles";
import { navLinks } from "./config";

import { IconMoonStars, IconSun } from "@tabler/icons";

/**
 * Navbar component that is used in the AppShell if desktop version (see: components/layout/component.tsx)
 * @returns {ReactElement} Responsible div element with given options.
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app Next.js Custom App}
 * @see {@link https://mantine.dev/core/getting-started/ Mantine Core}
 * @see {@link https://mantine.dev/core/app-shell/ AppShell}
 * @example
 * <Navbar />
 **/
export const Navbar: FunctionComponent = (): ReactElement => {
  const { classes, theme, cx } = useStyles();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [active, setActive] = useState(
    navLinks.find((link) =>
      link.sublinks.some((sub) => sub.href === router.pathname)
    ) ?? navLinks[0]
  );
  const [activeLink, setActiveLink] = useState(
    active.sublinks.find((link) => link.href === router.pathname)
  );

  const mainLinks = navLinks.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      color="dark.5"
      withArrow
      transitionDuration={0}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link)}
        className={cx(classes.mainLink, {
          [classes.mainLinkActive]: link.label === active.label,
        })}
      >
        <link.icon stroke={2} />
      </UnstyledButton>
    </Tooltip>
  ));

  const links = navLinks
    .find((link) => link.label === active.label)
    .sublinks.map((link) => (
      <Link
        className={cx(classes.link, {
          [classes.linkActive]: activeLink === link,
        })}
        href={link.href}
        onClick={() => setActiveLink(link)}
        key={link.label}
      >
        {link.label}
      </Link>
    ));

  return (
    <MantineNavbar width={{ sm: 300 }} withBorder={false}>
      <MantineNavbar.Section grow className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo} onClick={() => toggleColorScheme()}>
            <ActionIcon
              variant="light"
              color={!dark ? "splendid-green" : "purple-heart"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
              size={44}
            >
              {!dark ? <IconSun stroke={2} /> : <IconMoonStars stroke={2} />}
            </ActionIcon>
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active.label}
          </Title>
          <Paper
            h="100%"
            pt="xl"
            bg={
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
            }
            radius={theme.colorScheme === "dark" ? "sm" : 0}
          >
            {links}
          </Paper>
        </div>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};
