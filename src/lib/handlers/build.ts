import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export type Build = () => Promise<void>;

export const build: Build = async () => {
  execAsync("npm run build").then(() => {
    console.log("Build complete");
  }).catch(console.error);
};