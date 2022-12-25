import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

export interface UseAuth {
  user: string | null;
  login: (username: string, password: string) => Promise<void | number>;
  logout: () => void;
}

/**
 * @returns {object} user, login, logout
 * @returns {string} user - The user's access_token cookie if logged in
 * @returns {Promise<void | number>} login - The login function's response status along with setting the user in cookie
 * @returns {void} logout - Logs out the user by setting the cookie to empty
 *
 * @example
 * const { user, login, logout } = useAuth();
 **/
export const useAuth = (): UseAuth => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Find user by cookie if already logged in
    const token = localStorage.getItem("access_token");
    if (token) {
      setUser(token);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<void | number> => {
    // Make an API request for an access_token (JWT)
    // returns 401 if incorrect details, 200 if OK
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
        sameSite: true,
      });
      setUser(access_token);
      router.push("/");
    }
    return response.status;
  };

  const logout = (): void => {
    // Set a cookie empty if logged out
    setCookie("access_token", "", {
      maxAge: -1,
      path: "/",
      sameSite: true,
    });
    setUser(null);
    router.push("/");
  };

  return { user, login, logout };
};
