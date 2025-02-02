import globals from "globals";
import js from "@eslint/js";
import eslintPluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,  // ✅ Keep Node.js globals
        ...globals.jest,  // ✅ Add Jest globals (`test`, `beforeAll`, `expect`)
      },
    },
    plugins: {
      jest: eslintPluginJest, // ✅ Correct way to define plugins in Flat Config
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules, // ✅ Apply Jest rules
    },
  },
  js.configs.recommended, // ✅ Standard JavaScript rules
];
