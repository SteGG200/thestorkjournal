// tailwind.config.js
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			theme: {
				colors: {
					mainred: '#db2424',
				}
			},
			colors: {
				red: {
					750: '#a91616'
				}
			}
		}
	},
	plugins: []
};

export default config