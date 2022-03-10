import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			env: {
				host: 'BUDDYSTUDY_HOST',
				port: 'BUDDYSTUDY_PORT',
				origin: 'BUDDYSTUDY_ORIGIN'
			}
		})
	}
};

export default config;
