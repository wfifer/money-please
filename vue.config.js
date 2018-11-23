const path = require('path');

module.exports = {
	chainWebpack: (config) => {
		// inline svg

		const svgRule = config.module.rule('svg');

		svgRule.uses.clear();

		svgRule
			.use('vue-svg-loader')
				.loader('vue-svg-loader');

		// import mixins/vars in scss files

		const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
		types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));
	}
};

function addStyleResource (rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, './src/styles/mixins/main.scss'),
			],
		});
}