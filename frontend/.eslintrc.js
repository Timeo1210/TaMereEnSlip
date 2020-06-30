module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
    },
    "extends": ["airbnb"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 11,
        "sourceType": "module",
    },
    "plugins": [
        "react",
    ],
    "rules": {
        "indent": "off",
        "quotes": "off",
        "quote-props": "off",
        "global-require": "off",
        "import/no-extraneous-dependencies": "off",
        "import/newline-after-import": "off",
        "no-unused-vars": "warn",
        "object-curly-spacing": "off",
        "no-console": "off",
        "import/order": "off",
        "padded-blocks": "off",
        "react/jsx-filename-extension": "off",
        "react/jsx-indent": "off",
        "react/jsx-one-expression-per-line": "off",
        "react/jsx-indent-props": "off",
        "react/prefer-stateless-function": "off",
    },
};
