module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue', '.ts', '.mjs', '.cjs'],
    sourceType: 'module',
    ecmaVersion: '2020',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
  ],
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'vue/require-default-prop': 'off'
  },
};
