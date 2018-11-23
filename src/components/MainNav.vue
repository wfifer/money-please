<template>
	<nav class="main-nav">
		<div class="container d-flex justify-content-between align-items-center">
			<div class="logo">
				<router-link to="/" class="font-headline">
					<Logo class="d-none d-md-inline-block" />
					<LogoMark class="d-md-none" />
				</router-link>
			</div>

			<ul class="list nav-list">
				<li class="nav-item">
					<router-link class="nav-link" :to="{ name: 'home' }">
						<span class="text">Dashboard</span>

						<span class="invoice-count">{{ invoiceCount }}</span>
					</router-link>
				</li>

				<li class="nav-item">
					<router-link class="btn btn-default" :to="{ name: 'invoice' }">
						<IconReceipt class="icon" />

						<span class="text">New invoice</span>
					</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
import { mapState } from 'vuex';
import Logo from '@/assets/svg/logo.svg';
import LogoMark from '@/assets/svg/logo-mark.svg';
import IconReceipt from '@/assets/svg/icon-receipt.svg';

export default {
	name: 'MainNav',
	components: {
		Logo,
		LogoMark,
		IconReceipt
	},
	computed: {
		...mapState({
			invoiceCount: state => state.invoice.invoices.reduce((acc, i) => i.empty ? acc : acc + 1, 0)
		})
	}
};
</script>

<style src="@/styles/components/main-nav.scss" lang="scss" scoped></style>