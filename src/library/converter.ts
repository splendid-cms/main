import { dynamicImport } from "tsimportlib";

// unified doesn't support commonjs, so we need to use dynamic import
const unified = dynamicImport("unified", module);
const remarkParse = dynamicImport("remark-parse", module);
const remarkRehype = dynamicImport("remark-rehype", module);
const rehypeSanitize = dynamicImport("rehype-sanitize", module);
const rehypeStringify = dynamicImport("rehype-stringify", module);
const remarkGfm = dynamicImport("remark-gfm", module);

/**
 * Converts markdown to html via remark and rehype.
 * @param markdown - a markdown query as a string to convert to html
 * @returns HTML as a string
 */
export const convert = async (markdown: string): Promise<string> => {
  return (await unified)
    .unified()
    .use([
      (await remarkParse).default,
      (await remarkGfm).default,
      (await remarkRehype).default,
      (await rehypeSanitize).default,
      (await rehypeStringify).default,
    ])
    .process(markdown)
    .then((file) => String(file));
};
