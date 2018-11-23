import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store/index';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/invoice/:index?',
			name: 'invoice',
			component: () => import('@/views/Invoice.vue'),
			props: true
		}
	]
});

router.beforeEach((to, from, next) => {
	store.dispatch('removeEmptyInvoices');

	next();
});

export default router;