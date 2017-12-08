module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'semi': ['error', 'never'],
    'max-len': ['error', 160, 2],
    'no-param-reassign': ['error', { 'props': false }],
    'space-before-function-paren': ['error', 'never'],
    'comma-dangle': ['error', 'only-multiline'],
    'yoda': 'off',
    'eqeqeq': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'no-new': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    'PREFIX': true,
    'NETROOT': true,
    '$': true,
  }
}
