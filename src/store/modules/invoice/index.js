'use strict';

import * as type from './types';
import actions from './actions';

const getFromStorage = (storageKey) => {
	let jsonString = localStorage.getItem(storageKey);

	if (!jsonString) {
		return null;
	}

	let arr = JSON.parse(jsonString);

	arr.forEach((obj) => {
		['invoiceDate', 'dueDate', 'lastEdited'].forEach((key) => {
			if (obj[key] && obj[key].length > 0) {
				obj[key] = new Date(obj[key]);
			}
		});
	});

	return arr;
}

const state = {
	invoices: getFromStorage('invoices') || [],
	currentInvoice: -1
};

const createLineItem = () => ({
	item: '',
	rate: 0,
	qty: 1,
	total: 0
});

const createNewInvoice = () => ({
	logo: null,
	from: '',
	billTo: '',
	invoiceNumber: '',
	invoiceDate: '',
	paymentTerms: '',
	dueDate: '',
	lineItems: [
		createLineItem()
	],
	taxType: '%',
	taxAmount: 0,
	subtotal: 0,
	total: 0,
	paid: 0,
	notes: '',
	empty: true,
	lastEdited: new Date()
});

const saveInvoices = (invoices) => {
	localStorage.setItem('invoices', JSON.stringify(invoices));
};

const updateInvoice = (state, invoice, index) => {
	invoice.total = invoice.subtotal + invoice.taxAmount * (invoice.taxType === '%' ? invoice.subtotal / 100 : 1)

	invoice.empty =
		!Object.keys(invoice)
			.filter(key => !['lineItems', 'lastEdited', 'taxType', 'taxAmount', 'paid'].includes(key))
			.some(key => invoice[key] && (invoice[key].length > 0 || invoice[key] instanceof Date || Object.keys(invoice[key].length > 0)))
		&&
		invoice.lineItems
			.every(item => {
				let emptyLineItem = createLineItem();
				return Object.keys(item)
					.every(column => item[column] == emptyLineItem[column]);
			});

	invoice.lastEdited = new Date();

	let invoices = [ ...state.invoices ];
	invoices[index] = invoice;
	state.invoices = invoices;

	saveInvoices(state.invoices);
};

const mutations = {
	[type.CREATE_NEW_INVOICE] (state) {
		state.invoices = [ ...state.invoices, createNewInvoice() ];
		state.currentInvoice = state.invoices.length - 1;

		saveInvoices(state.invoices);
	},
	[type.DELETE_INVOICE] (state, action) {
		let invoices = [ ...state.invoices ];
		invoices.splice(action.index, 1);
		state.invoices = invoices;

		saveInvoices(state.invoices);
	},
	[type.REMOVE_EMPTY_INVOICES] (state) {
		let invoices = [ ...state.invoices ];

		state.invoices = invoices.filter(invoice => !invoice.empty);

		saveInvoices(state.invoices);
	},
	[type.SELECT_INVOICE] (state, action) {
		state.currentInvoice = action.index;

		saveInvoices(state.invoices);
	},
	[type.UPDATE_INVOICE] (state, action) {
		let invoice = { ...state.invoices[action.index] };

		invoice[action.name] = action.value;

		updateInvoice(state, invoice, action.index);
	},
	[type.UPDATE_LINE_ITEM] (state, action) {
		let invoice = { ...state.invoices[state.currentInvoice] };

		let item = invoice.lineItems[action.index];
		item[action.name] = action.value;

		if (['qty', 'rate'].includes(action.name)) {
			if (action.name === 'qty' && action.value < 0) {
				item[action.name] = 0;
			}

			item.total = item.rate * item.qty;

			invoice.subtotal = invoice.lineItems.reduce((acc, item) => {
				return acc + item.total
			}, 0);
		}

		invoice.lineItems[action.index] = item;

		updateInvoice(state, invoice, state.currentInvoice);
	},
	[type.ADD_LINE_ITEM] (state) {
		let invoice = { ...state.invoices[state.currentInvoice] };

		invoice.lineItems.push(createLineItem());

		updateInvoice(state, invoice, state.currentInvoice);
	},
	[type.REMOVE_LINE_ITEM] (state, action) {
		let invoice = { ...state.invoices[state.currentInvoice] };

		invoice.lineItems.splice(action.index, 1);

		updateInvoice(state, invoice, state.currentInvoice);
	}
};

export default {
	state,
	mutations,
	actions
};
