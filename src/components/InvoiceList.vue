<template>
	<transition name="t-invoice-list">
	<ol class="list invoice-list" v-if="invoices.length > 0">
		<li v-for="(invoice, index) in invoices" class="list-item" :key="`invoice-${ index }`">
			<div class="row">
				<div class="col-12 col-md-2 col-lg-3 d-flex justify-content-center justify-content-md-start align-items-center">
					<div class="item-info" v-html="getPreviewText(invoice)"></div>
				</div>

				<div class="col-12 col-md-3 col-lg-2 d-flex justify-content-center justify-content-md-end align-items-center">
					<span>Total:&nbsp;</span>
					<div class="item-info item-amount">${{ invoice.total.toFixed(2) }}</div>
				</div>

				<div class="money-field col-12 col-md-3 d-flex justify-content-center justify-content-md-end align-items-center">
					<label :for="`invoice-paid-${ index }`">Paid</label>

					<div class="input-group">
						<input :id="`invoice-paid-${ index }`" name="paid" @input="inputHandler($event, index)" :value="invoice.paid" type="number">
					</div>
				</div>

				<div class="col-12 col-md-4 col-lg-4 d-flex justify-content-center justify-content-md-end align-items-center">
					<router-link :to="{ name: 'invoice', params: { index } }" class="btn btn-secondary btn-sm">
						<IconEdit class="icon" />
						<span class="text">Edit</span>
					</router-link>

					<button type="button" class="btn btn-warning btn-sm" @click="deleteInvoice(index)">
						<IconRemove class="icon" />
						<span class="text">Delete</span>
					</button>
				</div>
			</div>
		</li>
	</ol>

	<div v-else class="text-center">You don't have any saved invoices. <router-link :to="{ name: 'invoice' }">Create one now.</router-link></div>
	</transition>
</template>

<script>
import { mapActions } from 'vuex';
import IconRemove from '@/assets/svg/icon-remove.svg';
import IconEdit from '@/assets/svg/icon-edit.svg';

export default {
	name: 'InvoiceList',
	props: {
		invoices: {
			default: () => [],
			type: Array
		}
	},
	components: {
		IconRemove,
		IconEdit
	},
	methods: {
		getPreviewText (invoice) {
			let keys = [ 'invoiceNumber', 'billTo', 'from', 'lastEdited' ];
			let text = keys
				.filter(key => invoice[key].toString().length > 0)
				.map(key => key === 'lastEdited' ? invoice[key].toLocaleDateString("en-US") : invoice[key])
				.join(' &bull; ');
			return text;
		},
		inputHandler (e, index) {
			let value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
			this.updateInvoice({
				name: e.target.name,
				value,
				index
			});
		},
		...mapActions([
			'deleteInvoice',
			'updateInvoice'
		])
	}
};
</script>

<style src="@/styles/components/invoice-list.scss" lang="scss"></style>