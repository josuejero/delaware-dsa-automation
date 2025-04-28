// eslint.config.js
export const ignores = ["backend/dist/", "dashboard/dist/"];

import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Apply JS rules to all .js files
  {
    files: ["*.js", "src/**/*.js", "backend/**/*.js", "dashboard/**/*.js"],
    ...js.configs.recommended,
  },
  // Apply TS rules to all .ts/.tsx files
  {
    files: [
      "*.ts",
      "src/**/*.ts",
      "backend/**/*.ts",
      "dashboard/**/*.ts",
      "dashboard/**/*.tsx",
    ],
    languageOptions: { parser: tsParser },
    plugins: { "@typescript-eslint": ts },
    rules: {
      ...ts.configs["recommended"].rules,
      // add or override rules here
    },
  },
];
