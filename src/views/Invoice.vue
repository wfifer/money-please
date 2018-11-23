<template>
	<div>
		<div class="container">
			<InvoiceForm class="page-tile" :invoice="invoice" :invoiceIndex="currentInvoice" />
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import InvoiceForm from '@/components/InvoiceForm';

export default {
	name: 'Invoice',
	components: {
		InvoiceForm
	},
	mounted () {
		this.checkRoute();
	},
	computed: {
		...mapState({
			currentInvoice: state => state.invoice.currentInvoice,
			invoice: state => state.invoice.invoices[state.invoice.currentInvoice]
		})
	},
	methods: {
		checkRoute () {
			let index = typeof this.$route.params.index !== 'undefined' ? parseInt(this.$route.params.index) : -1;
			this.selectInvoice(index);
		},
		...mapActions([
			'selectInvoice'
		])
	},
	watch: {
		$route: function () {
			this.checkRoute();
		}
	}
};
</script>