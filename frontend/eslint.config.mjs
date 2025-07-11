import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Apply shared Next.js and TypeScript configs as flat objects
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ),
  // Register the Prettier plugin instance
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Custom settings and rules
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Treat Prettier issues as errors
      "prettier/prettier": "error",
      // Common React/TypeScript tweaks
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];

