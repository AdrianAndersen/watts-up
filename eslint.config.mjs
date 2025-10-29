// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import pluginQuery from "@tanstack/eslint-plugin-query";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import noRelativeImportPathsPlugin from "eslint-plugin-no-relative-import-paths";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_PATHS = [
  path.join(__dirname, "tsconfig.json"),
  path.join(__dirname, "tsconfig.eslint.json"),
];

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: PROJECT_PATHS,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "no-relative-import-paths": noRelativeImportPathsPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: PROJECT_PATHS,
        }),
      ],
      // Needed for boundaries to import aliases
      "import/resolver": {
        typescript: { project: PROJECT_PATHS, alwaysTryTypes: true },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "import-x/no-unused-modules": [
        1,
        {
          unusedExports: true,
          missingExports: true,
          ignoreExports: [
            "**/*{page,error,loading,layout,spec,config,next-env.d,instrumentation,instrumentation-client,adonisrc,robots}.{ts,tsx}",
            "postcss.config.mjs",
            "eslint.config.mjs",
          ],
        },
      ],
      "import-x/no-named-as-default-member": "off",
      "import-x/no-named-as-default": "off",
      "no-relative-import-paths/no-relative-import-paths": "error",
      /** @see https://medium.com/weekly-webtips/how-to-sort-imports-like-a-pro-in-typescript-4ee8afd7258a */
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "unknown",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      /** */
    },
  },
  eslintConfigPrettier,
);
