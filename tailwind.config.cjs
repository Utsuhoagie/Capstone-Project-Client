/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			// london: ['London'],
			notoSans: ['Noto Sans'],
		},
		extend: {
			width: {
				'button-small': 100,
				'button-medium': 140,
				'button-big': 180,
				'button-full': 'full',
			},
			fontSize: {
				h1: ['32px', { lineHeight: '36px' }],
				h2: ['24px', { lineHeight: '28px' }],
				h3: ['20px', { lineHeight: '24px' }],
				h4: ['18px', { lineHeight: '22px' }],
				body: ['16px', { lineHeight: '20px' }],
				tag: ['14px', { lineHeight: '16px' }],
			},
			fontWeight: {},
			colors: {
				primary: {
					dark: {
						2: colors.indigo[900],
						1: colors.blue[800],
					},
					normal: colors.blue[700],
					bright: {
						1: colors.blue[400],
						2: colors.blue[100],
					},
				},
				secondary: {
					dark: colors.violet[700],
					normal: colors.violet[500],
					bright: colors.violet[300],
				},
				accent: {
					dark: colors.emerald[600],
					normal: colors.emerald[400],
					bright: colors.emerald[200],
				},
				neutral: {
					black: '#000000',
					gray: {
						9: colors.gray[900],
						8: colors.gray[700],
						7: colors.gray[600],
						6: colors.gray[500],
						5: colors.gray[400],
						4: colors.gray[300],
						3: colors.gray[200],
						2: colors.gray[100],
						1: colors.gray[50],
					},
					white: '#ffffff',
				},
			},
		},
	},
	plugins: [],
};
