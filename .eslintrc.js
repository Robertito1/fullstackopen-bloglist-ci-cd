module.exports = {
    env: {
        commonjs: true,
        es2015: true,
        node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: { ecmaVersion: 6 },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-console': 0,
    },
}
