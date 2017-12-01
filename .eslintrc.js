module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  env: {
    browser: true,
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
    'no-param-reassign': ["error", { "props": false }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-restricted-syntax': process.env.NODE_ENV === 'production' ? [
      2,
      'DebuggerStatement',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ] : [
        2,
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],
    'no-alert': 'off',
    'no-console': 'off'

  }
}
