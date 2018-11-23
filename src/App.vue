<template>
	<div id="app" class="money-please -show-hover -show-focus">
		<MainNav />

		<router-view />
	</div>
</template>

<script>
import MainNav from '@/components/MainNav.vue';

export default {
	name: 'app',
	components: {
		MainNav
	}
};
</script>

<style src="@/styles/theme/global.scss" lang="scss"></style>