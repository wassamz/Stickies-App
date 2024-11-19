import globals from "globals";
import pluginReact from "eslint-plugin-react"; // Import React plugin
import pluginJest from "eslint-plugin-jest"; // Import Jest plugin
import babelParser from "@babel/eslint-parser"; // Import Babel parser


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Handle .js and .jsx files
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly", // Specifically declare 'process' as a global variable
      },
      parser: babelParser, // Use Babel parser to understand JSX
      parserOptions: {
        requireConfigFile: false, // Avoid requiring a Babel config file
        babelOptions: {
          presets: ["@babel/preset-react"], // Use the React preset to parse JSX
        },
      },
    },
  },
  {
    plugins: { // Convert to object
      react: pluginReact, // Use pluginReact as the value for 'react' namespace
      jest: pluginJest, // Use pluginJest as the value for 'jest' namespace
    },
    // ... React-specific rules here
  },
  // ... Jest-specific rules here (if needed)
];