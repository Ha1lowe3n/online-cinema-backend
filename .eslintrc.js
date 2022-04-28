module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/explicit-function-return-type': ['warn'],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: ['PascalCase'],
				custom: {
					regex: '^I[A-Z]',
					match: true,
				},
			},
		],
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				useTabs: true,
				semi: true,
				trailingComma: 'all',
				bracketSpacing: true,
				printWidth: 100,
				endOfLine: 'auto',
				tabWidth: 4,
			},
		],
	},
};
