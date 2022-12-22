import { useStyles } from "./styles";

export interface Link {
    label: string;
    href: string;
}

export type Styling = ReturnType<typeof useStyles>;

export interface FooterProps {
    links: Link[];
}
