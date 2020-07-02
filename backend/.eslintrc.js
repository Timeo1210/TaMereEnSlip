module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "extends": ["airbnb-base"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parserOptions": {
        "ecmaVersion": 11,
    },
    "rules": {
        "indent": ["error", 4],
        "quotes": "off",
        "quote-props": "off",
        "global-require": "off",
        "import/no-extraneous-dependencies": "off",
        "import/newline-after-import": "off",
        "no-unused-vars": "warn",
        "object-curly-spacing": "off",
        "no-console": "off",
        "import/order": "off",
        "no-underscore-dangle": "off",
        "consistent-return": "off",
        "max-len": "off",
    },
};
