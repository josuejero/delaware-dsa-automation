// eslint.config.mjs
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  // 1) JS files
  {
    files: [
      "*.js",
      "src/**/*.js",
      "backend/**/*.js",
      "dashboard/**/*.js",
      "dashboard/next.config.js",
      "dashboard/tailwind.config.js",
      "jest.config.js",
    ],
    ...js.configs.recommended,
  },

  // 2) Ignore outputs
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },

  // 3) TS/TSX files
  {
    files: [
      "*.ts",
      "src/**/*.ts",
      "backend/**/*.ts",
      "dashboard/**/*.ts",
      "dashboard/**/*.tsx",
      "dashboard/src/next.config.js",
      "dashboard/tailwind.config.js",
      "jest.config.js" // if necessary
    ],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",        // <-- valid here
      },
      globals: {
        ...globals.node,            // bring in Node.js globals
        module: "readonly",         // if you still need `module`
      },
    },

    plugins: { "@typescript-eslint": ts },

    rules: {
      ...ts.configs["recommended"].rules,
      // your overrides…
    },
  },
];
