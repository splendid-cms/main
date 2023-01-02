type UseChangeLog = [
  ChangeLog[],
  boolean,
  boolean
]

interface ChangeLog {
  author: {
    name: string;
    avatar: string;
    url: string;
  };
  name: string;
  body: {
    markdown: string;
    html: string;
  };
  publishedAt: Date;
}

type UseOverview = [
  Overview,
  boolean,
  boolean
]

interface Overview {
  body: {
    markdown: string;
    html: string;
  };
}