import type { NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";

const Logout: NextPage = (): JSX.Element => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  return <div>Logging out...</div>;
};

export default Logout;
