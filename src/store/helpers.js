export default {
	getApiUrl (path) {
		let url = `${ process.env.API_BASE }/${ path }`;

		return url;
	}
};