module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  rules: {
    'no-use-before-define': 0,
    'max-len': 0,
    'no-shadow': 0,
    'no-param-reassign': 0,
    'no-unused-vars': 0,
    'no-undef': 0,
    'linebreak-style': 0,
    'prefer-const': 0,
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
  },
};
