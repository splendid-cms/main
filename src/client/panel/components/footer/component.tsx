import { useStyles } from "./styles";
import Image from "next/image";

import type { FooterProps, Link as LinkType, Styling } from "./types";
import type { FunctionComponent } from "react";

import { Container, Group, Anchor } from "@mantine/core";
import Link from "next/link";

import PlatformBlack from "@public/brandbook/platform-black.svg";

/**
 * Footer component that is used in the AppShell (see: src/pages/_app.tsx)
 * @param {LinkType[]} links - Footer properties aka array of links to display.
 * @returns {JSX.Element} Responsible div element with given options.
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app Next.js Custom App}
 * @see {@link https://mantine.dev/core/getting-started/ Mantine Core}
 * @example
 * <Footer links={[{ label: 'Link 1', href: '#' }, { label: 'Link 2', href: '#' }]} />
 **/
export const Footer: FunctionComponent<FooterProps> = ({
    links,
}: {
    links: LinkType[];
}): JSX.Element => {
    const { classes }: Styling = useStyles();

    const items = links.map((link) => (
        <Link key={link.label} href={link.href} legacyBehavior>
            <Anchor<"a"> color="dimmed" key={link.label} size="sm">
                {link.label}
            </Anchor>
        </Link>
    ));

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <Image
                    src={PlatformBlack}
                    alt="Platform"
                    height={28}
                    width={28}
                />
                <Group className={classes.links}>{items}</Group>
            </Container>
        </div>
    );
};
