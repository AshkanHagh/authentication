import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    { languageOptions : { globals : globals.node } },
    ...tseslint.configs.recommended,
    {
        rules : {
            quotes: ['warn', 'single', { 'avoidEscape': true }],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^password$',  // Ignore 'next' if unused
                },
            ],
        }
    }
];