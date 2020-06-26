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
        "indent": ["error", 4],
        "quotes": "off",
        "quote-props": "off",
    },
};
