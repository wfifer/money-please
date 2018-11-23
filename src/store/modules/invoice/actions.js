'use strict';

import * as type from './types';

const actions = {
	createNewInvoice ({ commit }) {
		commit(type.CREATE_NEW_INVOICE);
	},
	selectInvoice ({ commit, state }, index) {
		let commitType = index in state.invoices ? 'SELECT_INVOICE' : 'CREATE_NEW_INVOICE';
		commit(type[commitType], { index });
	},
	deleteInvoice ({ commit }, index) {
		commit(type.DELETE_INVOICE, { index });
	},
	removeEmptyInvoices ({ commit }) {
		commit(type.REMOVE_EMPTY_INVOICES);
	},
	updateInvoice ({ commit }, { name, value, index }) {
		commit(type.UPDATE_INVOICE, {
			name,
			value,
			index
		});
	},
	updateLineItem ({ commit }, { name, value, index }) {
		commit(type.UPDATE_LINE_ITEM, {
			name,
			value,
			index
		});
	},
	addLineItem ({ commit }) {
		commit(type.ADD_LINE_ITEM);
	},
	removeLineItem ({ commit }, index) {
		commit(type.REMOVE_LINE_ITEM, {
			index
		});
	}
};

export default actions;
