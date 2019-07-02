<template>
  <div class="mt-3">
    <h2 class="text-center text-secondary">Dashboard</h2>
    <b-container class="w-75">
      <b-card>
        <b-container class="bv-example-row">
          <b-form @submit="onSubmit">
            <b-row>
              <b-col sm="auto" md="4">
                <b-form-group id="input-group-3" label="Symbols" label-for="input-3">
                  <b-form-select id="input-3" v-model="form.symbol" :options="currency" required></b-form-select>
                </b-form-group>
              </b-col>
              <b-col sm="auto" md="4">
                <b-form-group id="input-group-2" label="Public address" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="form.address"
                    required
                    placeholder="Enter public address"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="auto" md="4">
                <b-form-group id="input-group-2" label="Search" label-for="input-2">
                  <b-button class="w-auto" type="submit" variant="primary">
                    <span v-if="loading" class="pl-3 pr-3">
                      <b-spinner small></b-spinner>
                    </span>
                    <span v-if="!loading">Search</span>
                  </b-button>
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-container>
      </b-card>
      <b-card class="mt-3" title="Balance" v-if="Object.keys(transactions).length">
        <b-card-text>
          <span class="font-weight-bold">Amount Received:</span>
          {{ transactions.amountReceived ? transactions.amountReceived : 'No Data' }}
        </b-card-text>
        <b-card-text>
          <span class="font-weight-bold">Amount AmountSent:</span>
          {{ transactions.amountSent ? transactions.amountSent : 'No data' }}
        </b-card-text>
        <b-card-text>
          <span class="font-weight-bold">Balance:</span>
          {{ transactions.balance }}
        </b-card-text>
        <b-card-text>
          <span class="font-weight-bold">Symbol:</span>
          {{ transactions.symbol }}
        </b-card-text>
        <b-card-text>
          <span class="font-weight-bold">Address:</span>
          {{ transactions.address }}
        </b-card-text>
        <b-card-text>
          <span class="font-weight-bold">Record_id:</span>
          {{ transactions.record_id }}
        </b-card-text>
      </b-card>
      <!-- Table Component -->
      <b-card class="mt-3" title="Transactions" v-if="Object.keys(transactions).length">
        <Table :items="transactions.transactions"/>
      </b-card>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table.vue";
import { sync, get, call } from "vuex-pathify";
export default {
  name: "dashboard",
  components: {
    Table
  },
  data() {
    return {
      loading: false,
      form: {
        symbol: null,
        address: ""
      },
      currency: []
    };
  },
  computed: {
    currencySymbol: sync("dashboard/currencySymbol"),
    transactions: get("dashboard/transactions")
  },
  created() {
    this.fetchCurrencySymbols();
  },
  methods: {
    api_getSymbols: call("dashboard/getCurrencySymbols"),
    api_saveTransactionToDB: call("dashboard/saveTransactionToDB"),
    onSubmit(evt) {
      this.loading = true;
      evt.preventDefault();
      this.api_saveTransactionToDB(this.form)
        .then(res => {
          this.loading = false;
          this.clearForm();
        })
        .catch(err => {
          this.loading = false;
          this.clearForm();
        });
    },
    clearForm() {
      (this.form.symbol = null), (this.form.address = "");
    },
    fetchCurrencySymbols() {
      this.currencySymbol = [];
      this.currency.push({ text: "Select One", value: null });
      this.api_getSymbols().then(res => {
        this.setCurrencySymbolDropDown();
      });
    },
    // set currency symbol dropdown Data
    setCurrencySymbolDropDown() {
      this.currencySymbol.forEach(element => {
        this.currency.push(element.symbol);
      });
    }
  }
};
</script>
