import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

const IndexPage: NextPage = (): ReactElement => {
  const { push }: NextRouter = useRouter();

  useEffect(() => {
    push("/dashboard");
  }, [push]);

  return <></>;
};

export default IndexPage;