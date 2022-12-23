import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { NextRouter, useRouter } from "next/router";
import { NextPageWithLayout } from "@page/_app";
import { Title } from "@mantine/core";

const Logout: NextPageWithLayout = (): JSX.Element => {
  const { logout } = useAuth();
  const { push }: NextRouter = useRouter();

  useEffect(() => {
    logout();
    push("/");
  }, [logout, push]);

  return (
    <Title order={1} align="center">
      Logging out...
    </Title>
  );
};

Logout.getLayout = (page) => page;

export default Logout;
