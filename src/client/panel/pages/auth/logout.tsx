import { ReactElement, useEffect } from "react";
import { useAuth } from "../../hooks/auth";
import { NextRouter, useRouter } from "next/router";
import { NextPageWithLayout } from "@page/_app";
import { Title } from "@mantine/core";

const Logout: NextPageWithLayout = (): ReactElement => {
  const [ _, __, logout ]: UseAuth = useAuth();
  const { push }: NextRouter = useRouter();

  useEffect(() => {
    logout();
    push("/auth/login");
  }, [logout, push]);

  return (
    <Title order={1} align="center">
      Logging out...
    </Title>
  );
};

Logout.getLayout = (page) => page;

export default Logout;
