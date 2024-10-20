/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/valid-v-slot': ['error', { allowModifiers: true }],//desactivar slot modifier
    'no-unused-vars': 'off', // Desactivar la regla no-unused-vars
    //estamos indicando a ESLint que permita la declaración de variables dentro de bloques case 
    'no-case-declarations': ['off', { 'ignorePatterns': ['^case\\s+[\\s\\S]+?:'] }]//
  },
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
        'cypress/support/**/*.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
   sourceType: 'module', // Para permitir importaciones de ES
  }
}
