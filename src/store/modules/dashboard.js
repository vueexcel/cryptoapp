import { make } from "vuex-pathify";
import axios from "./../axios";
const state = {
  currencySymbol: [],
  transactions: {}
};
const mutations = {
  ...make.mutations(state)
};
const actions = {
  async getCurrencySymbols() {
    state.currencySymbol = [];
    try {
      let res = await axios.get("/currency_symbol");
      if (res.status === 200) {
        state.currencySymbol = res.data;
      } else {
        console.log(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  },
  // save transactions to DB
  async saveTransactionToDB({ state, dispatch }, payload) {
    const address = payload.address;
    try {
      let res = await axios.post("/transaction", payload);
      if (res.status === 200) {
        // state.currencySymbol = res.data;
        dispatch("fetchTransactions", address);
        return res;
      } else {
        console.log(res.status, "something went wrong");
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  },
  // fetch data for table
  async fetchTransactions({ state }, payload) {
    state.transactions = {};
    try {
      let res = await axios.get(`/local_transaction/${payload}`);
      if (res) {
        state.transactions = res.data[0];
      } else {
        console.log(res, "something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
