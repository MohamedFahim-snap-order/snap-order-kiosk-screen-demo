import { defineConfig, globalIgnores } from "eslint/config";
import nextParser from "next/dist/compiled/babel/eslint-parser.js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

const parser = {
  meta: nextParser.meta,
  parseForESLint(code, options) {
    const result = nextParser.parseForESLint(code, options);

    return {
      ast: result.ast,
      services: result.services ?? {},
      visitorKeys: result.visitorKeys,
    };
  },
};

const eslintConfig = defineConfig([
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: "module",
        babelOptions: {
          presets: ["next/babel"],
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooks.configs.flat.recommended.rules,
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "postman/**"]),
]);

export default eslintConfig;
