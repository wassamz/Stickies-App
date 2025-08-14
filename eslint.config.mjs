import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
    plugins: {
      react: pluginReact,
      jest: pluginJest,
    },
    rules: {
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Enable if you use PropTypes
    },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/*.test.[jt]s?(x)"],
    plugins: {
      jest: pluginJest,
    },
    env: {
      jest: true,
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];