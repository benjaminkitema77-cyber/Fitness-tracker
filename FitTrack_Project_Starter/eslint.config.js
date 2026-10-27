export default [
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly", document: "readonly", fetch: "readonly",
        console: "readonly", FormData: "readonly", Date: "readonly",
        Math: "readonly", Number: "readonly", String: "readonly",
        Object: "readonly", Array: "readonly", Promise: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "eqeqeq": ["error", "always"],
      "semi": ["error", "always"],
    },
  },
];
