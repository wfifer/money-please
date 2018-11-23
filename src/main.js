import '@babel/polyfill';

import Vue from 'vue';
import router from '@/router';
import store from '@/store/index';
import { sync } from 'vuex-router-sync';

import VueWait from 'vue-wait';
import './plugins/bootstrap-vue';

import App from './App';

sync(store, router);
Vue.use(VueWait);

Vue.config.productionTip = false;

new Vue({
    router,
	store,
	wait: new VueWait({
		useVuex: true
	}),
    render: h => h(App)
}).$mount('#app');