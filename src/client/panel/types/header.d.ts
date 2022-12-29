interface Sublink {
  label: string;
  href: string;
}

interface Link {
  icon: React.FC<any>;
  label: string;
  sublinks: Sublink[];
};