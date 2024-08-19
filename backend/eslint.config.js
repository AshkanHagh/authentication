import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        files : ['*.ts', '*.tsx'],
        languageOptions : {
            globals : globals.node
        },
        ...tseslint.configs.recommended,
        rules : {
            'quotes' : ['warn', 'single', { 'avoidEscape' : true }],
            'no-unused-vars' : ['warn', {
                'vars' : 'all',
                'args' : 'after-used',
                'ignoreRestSiblings' : true,
                'varsIgnorePattern' : 'password'
            }],
            '@typescript-eslint/type-annotation-spacing' : ['warn', {
                'before' : true,
                'after' : true
            }]
        }
    }
]