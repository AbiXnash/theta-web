import js from "@eslint/js";
import globals from "globals";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const ignores = [
  "**/*.log",
  "**/.DS_Store",
  "dist",
  "dist-dev",
  "node_modules",
];

export default [
  globalIgnores(ignores),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
