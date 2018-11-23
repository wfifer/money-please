<template>
	<div class="view-home">
		<div class="container">
			<div class="row">
				<div class="dashboard-amount col-12 col-md-4">
					<div class="page-tile text-center d-flex d-md-block justify-content-between align-items-center">
						<h2>Collected</h2>

						<div class="headline-amount color-mint" v-html="dollarsAndCents(total('paid'))"></div>
					</div>
				</div>

				<div class="dashboard-amount col-12 col-md-4">
					<div class="page-tile text-center d-flex d-md-block justify-content-between align-items-center">
						<h2>Due</h2>

						<div class="headline-amount color-tomato" v-html="dollarsAndCents(total('total') - total('paid'))"></div>
					</div>
				</div>

				<div class="dashboard-amount col-12 col-md-4">
					<div class="page-tile text-center d-flex d-md-block justify-content-between align-items-center">
						<h2>Invoiced</h2>

						<div class="headline-amount color-pinot" v-html="dollarsAndCents(total('total'))"></div>
					</div>
				</div>
			</div>
			<div class="page-tile">
				<InvoiceList :invoices="invoices" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import InvoiceList from '@/components/InvoiceList';

export default {
	name: 'Home',
	components: {
		InvoiceList
	},
	computed: {
		...mapState({
			invoices: state => state.invoice.invoices
		})
	},
	methods: {
		total (key) {
			return this.invoices.reduce((acc, invoice) => acc + invoice[key], 0);
		},
		dollarsAndCents (amount) {
			return `<span class="dollars">${ Math.floor(amount) }</span>
					<span class="cents">.${ amount.toFixed(2).split('.')[1] }</span>`;
		}
	}
};
</script>

<style src="@/styles/views/home.scss" lang="scss" scoped></style>