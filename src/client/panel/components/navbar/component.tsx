import { FunctionComponent, ReactElement, useState } from "react";
import {
  Navbar as MantineNavbar,
  UnstyledButton,
  Tooltip,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useStyles } from "./styles";
import { navLinks } from "./config";

import SplendidLogo from "@public/splendid-colored.svg";

export const Navbar: FunctionComponent = (): ReactElement => {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();
  const [active, setActive] = useState(
    navLinks.find((link) =>
      link.sublinks.some((sub) => sub.href === router.pathname)
    ) ?? navLinks[0]
  );
  const [activeLink, setActiveLink] = useState(
    active.sublinks.find((link) => link.href === router.pathname) ??
      active.sublinks[0]
  );

  const mainLinks = navLinks.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
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
            <Image src={SplendidLogo} alt="Splendid" width={30} height={30} />
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active.label}
          </Title>
          {links}
        </div>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};
