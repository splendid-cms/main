import { NextConfig } from "next";

// We do not want to emit JSON files to the output directory,
// so we use require() instead of import.
export const pkg = require("../../../package.json");

export interface SplendidUser {
  id: number;
  name: string;
  password: string;
}

export interface SplendidConfig {
  websiteName: string,
  theme: string,
  icon: string,
  port: number,
  address: string,
  adminDashboardPrefix: string,
  users: SplendidUser[],
  auth: {
    secretKey: string,
    expiresIn: string
  },
  experimental: {
    developmentEnvironment: boolean,
    serverOptions: NextConfig
  }
}

export default pkg.splendid as SplendidConfig;