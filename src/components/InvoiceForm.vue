<template>
	<div class="invoice-form" v-if="invoice">
		<form>
			<div class="form-section row">
				<div class="col-md">
					<div class="form-field file-field" :class="invoice.logo ? '-with-file' : null">
						<div class="image">
							<img :src="invoice.logo ? invoice.logo.src : null" title="Logo" v-if="invoice.logo" />
						</div>

						<input name="logo" id="invoice-logo" type="file" accept="image/*" @input="fileUploadHandler">

						<label for="invoice-logo">Upload your logo</label>
					</div>

					<div class="form-field" v-for="(field) in headerFieldsLeft" :key="`invoice-${ field.name }`">
						<label :for="`invoice-form-${ field.name }`">{{ field.label }}</label>

						<textarea rows="2" :name="field.name" :id="`invoice-form-${ field.name }`" @input="inputHandler" :value="invoice ? invoice[field.name] : ''"></textarea>
					</div>
				</div>

				<div class="col-md d-lg-flex flex-column justify-content-between text-md-right">
					<div class="form-group">
						<h2 class="d-none d-md-block">Invoice</h2>

						<div class="form-field row no-gutters">
							<div class="col-12 col-md">
								<label for="invoice-form-invoice-number">Invoice #</label>
							</div>

							<div class="col-12 col-md">
								<input name="invoiceNumber" id="invoice-form-invoice-number" @input="inputHandler" :value="invoice ? invoice.invoiceNumber : ''">
							</div>
						</div>
					</div>

					<div class="form-group">
						<div class="form-field row no-gutters" :class="`${ field.type }-field`" v-for="(field, index) in headerFieldsRight" :key="`invoice-${ field.name }`">
							<div class="col-12 col-md">
								<label :for="`invoice-header-field-${ index }`">{{ field.label }}</label>
							</div>

							<div class="col-12 col-md input-group">
								<datepicker v-if="field.type === 'date'" :typeable="true" format="MM/dd/yyyy" :name="field.name" :id="`invoice-header-field-${ index }`" @input="dateInputHandler($event, field.name)" :value="invoice ? invoice[field.name] : ''"></datepicker>
								<input v-else :name="field.name" :id="`invoice-header-field-${ index }`" @input="inputHandler" :value="invoice ? invoice[field.name] : ''">
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="form-section">
				<table class="line-items">
					<thead>
						<tr>
							<th v-for="(column) in lineItemColumns" :key="`line-item-heading-${ column.name }`">{{ column.title }}</th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="(item, index) in invoice.lineItems" :key="`line-item-${ index }`">
							<td v-for="(column) in lineItemColumns.slice(0, lineItemColumns.length - 1)" :key="`line-item-${ index }-${ column.name }`">
								<div class="form-field" :class="['rate', 'total'].includes(column.name) ? 'money-field' : null">
									<label class="d-md-none">{{ column.title }}</label>

									<div class="input-group">
										<input :name="column.name" :value="item[column.name]" @input="updateColumn($event, index)" :type="column.type" :placeholder="column.hasOwnProperty('placeholder') ? column.placeholder : null">
									</div>
								</div>
							</td>

							<td class="total">
								<label class="d-md-none">Total</label>

								<div class="amount" v-html="dollarsAndCents(item.total)"></div>

								<button type="button" class="btn-remove-line-item" v-if="invoice.lineItems.length > 1" @click="removeLineItem(index)">
									<div class="button-icon">
										<IconRemove class="icon" />
									</div>
								</button>
							</td>
						</tr>
					</tbody>
				</table>

				<button class="btn btn-default btn-add-line-item" @click="addLineItem" type="button">
					<span class="text">Add line item</span>
				</button>
			</div>

			<div class="form-section">
				<div class="row justify-content-end">
					<div class="col-md-6 col-lg-4 invoice-total">
						<div class="row line-item">
							<div class="col-6 text-right">
								<div class="label">Subtotal:</div>
							</div>

							<div class="col-6 text-right">
								<div class="amount" v-html="dollarsAndCents(invoice.subtotal)"></div>
							</div>
						</div>

						<div class="row line-item -with-input">
							<div class="col-6 d-flex align-items-center justify-content-end">
								<div class="label">Tax:</div>
							</div>

							<div class="col-6 d-flex">
								<select name="taxType" id="invoice-form-tax-type" @input="inputHandler" :value="invoice.taxType">
									<option value="%" selected>%</option>
									<option value="$">$</option>
								</select>

								<input name="taxAmount" id="invoice-form-tax-amount" @input="inputHandler" :value="invoice.taxAmount">
							</div>
						</div>

						<div class="row line-item">
							<div class="col-6 text-right">
								<div class="label">Total due:</div>
							</div>

							<div class="col-6 text-right">
								<div class="amount" v-html="dollarsAndCents(invoice.total)"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="form-field">
					<label for="invoice-form-notes">Notes</label>

					<textarea name="notes" id="invoice-form-notes" @input="inputHandler" :value="invoice.notes"></textarea>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import IconRemove from '@/assets/svg/icon-remove.svg';

export default {
	name: 'InvoiceForm',
	components: {
		Datepicker,
		IconRemove
	},
	props: {
		invoice: {
			default: () => {},
			type: Object
		},
		invoiceIndex: {
			default: 0,
			type: Number
		}
	},
	data () {
		return {
			headerFieldsLeft: [
				{
					name: 'from',
					label: 'From',
					type: 'text'
				},
				{
					name: 'billTo',
					label: 'Bill to',
					type: 'text'
				}
			],
			headerFieldsRight: [
				{
					name: 'invoiceDate',
					label: 'Invoice Date',
					type: 'date'
				},
				{
					name: 'paymentTerms',
					label: 'Payment Terms',
					type: 'text'
				},
				{
					name: 'dueDate',
					label: 'Due Date',
					type: 'date'
				}
			],
			lineItemColumns: [
				{
					name: 'item',
					title: 'Item',
					type: 'text',
					placeholder: 'Description of item'
				},
				{
					name: 'rate',
					title: 'Rate',
					type: 'number'
				},
				{
					name: 'qty',
					title: 'Qty',
					type: 'number'
				},
				{
					name: 'total',
					title: 'Total',
					type: 'number',
					readonly: true
				}
			]
		}
	},
	methods: {
		fileUploadHandler (e) {
			let files = e.target.files;

			if (FileReader && files && files.length > 0) {
				let fr = new FileReader();
				let file = files[0];

				fr.onload = () => {
					this.updateInvoice({
						name: e.target.name,
						value: {
							src: fr.result,
							file: file
						},
						index: this.invoiceIndex
					});
				};

				fr.readAsDataURL(file);
			} else {
				this.updateInvoice({
					name: e.target.name,
					value: null,
					index: this.invoiceIndex
				});
			}
		},
		inputHandler (e) {
			this.updateInvoice({
				name: e.target.name,
				value: e.target.value,
				index: this.invoiceIndex
			});
		},
		dateInputHandler (e, name) {
			this.updateInvoice({
				name: name,
				value: e,
				index: this.invoiceIndex
			});
		},
		updateColumn (e, index) {
			this.updateLineItem({
				name: e.target.name,
				value: e.target.value,
				index
			});
		},
		dollarsAndCents (amount) {
			return `<span class="dollars">${ Math.floor(amount) }</span>
					<span class="cents">.${ amount.toFixed(2).split('.')[1] }</span>`;
		},
		...mapActions([
			'updateInvoice',
			'updateLineItem',
			'addLineItem',
			'removeLineItem'
		])
	}
}
</script>

<style src="@/styles/components/invoice-form.scss" lang="scss" scoped></style>

<!-- Having issues with sass-loader processing /deep/ in Vue CLI 3 build so pulling these out for now -->

<style lang="scss">
	.form-field {
		label {
			height: 5rem;

			line-height: 5rem;
			font-weight: 600;
		}

		.vdp-datepicker__calendar {
			margin-top: 2px;

			border: none;
			@include color-rgba(box-shadow, mint, 0.5, 0 0 0 1px);

			.cell {
				border-radius: 2px;

				transition: all $transition;

				&.selected {
					@include color(background, gold);
				}

				&:not(.blank):not(.disabled) {
					&.day, &.year {
						&:hover {
							@include color(border, pinot, 1px solid);
						}
					}
				}
			}
		}
	}

	input, select {
		height: 5rem;

		background: transparent;
	}

	input, textarea, select {
		display: block;
		padding: 1rem;
		width: 100%;

		border: 0;
		border-radius: 2px;
		@include color-rgba(box-shadow, pinot, 0.2, 0 0 0 1px);

		transition: all $transition;

		&:focus {
			outline: 0;
			border: 0;
			@include color(box-shadow, mint, 0 0 0 2px);
		}
	}

	.date-field {
		input {
			padding-right: 5rem;
		}
	}

	.line-items {
		.btn-remove-line-item {
			.icon {
				fill: white;
			}
		}
	}

	.amount {
		.dollars {
			display: inline-block;

			font-size: 3rem;

			&::before {
				content: '$';

				transform: translateY(-1px);

				display: inline-block;
				margin-right: 0.1em;

				font-family: $font-headline;
				font-size: 2rem;
			}
		}

		.cents {
			display: inline-block;
			margin-left: -0.3em;
			opacity: 0.75;

			font-size: 2rem;
			letter-spacing: 0.01;
		}
	}
</style>