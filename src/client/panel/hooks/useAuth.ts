import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setUser(token);
    }
  }, []);

  const login = async (username: string, password: string): Promise<void | number> => {
    const response: Response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const { access_token } = await response.json();
    if (access_token) {
      setCookie("access_token", access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: true
      });
      setUser(access_token);
      router.push("/");
    }
    return response.status;
  };

  const logout = (): void => {
    setCookie("access_token", "", {
      maxAge: -1,
      path: "/",
      sameSite: true
    });
    setUser(null);
    router.push("/");
  };

  return { user, login, logout };
};
