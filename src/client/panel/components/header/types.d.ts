import { TablerIcon } from "@tabler/icons";
import { useStyles } from "./styles";

export type Styling = ReturnType<typeof useStyles>;

export interface Sublink {
  label: string;
  href: string;
}

export interface Link {
  icon: TablerIcon;
  label: string;
  sublinks: Sublink[];
};