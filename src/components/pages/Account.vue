<template>
  <section class="section">
    <h2 style="margin-bottom: 0.5rem;">
      Your cards
      <span class="badge badge-primary">{{accountCards.length}}</span>
    </h2>
    <clickable-address :eth-address="account"></clickable-address>

    <div class="row mt-5" v-if="!accountCards || accountCards.length === 0">
      <div class="col text-center">
        <img src="/static/icons/radi-cards.svg" alt class="img--placeholder">
        <br><br>
        <h4>Aww...</h4><br>
        <p style="max-width: 24rem; margin: 0 auto;">You don't seem to have any cards yet. Why not send one to a friend — you might get a card back!</p>
        <br>
        <router-link :to="{ name: 'cardshop' }" class="btn">Send a card</router-link>
      </div>
    </div>

    <div class="row mt-2" v-else>
      <div class="col">
        <b-row>
          <b-col cols="12" sm="6" lg="4" v-if="accountCards && accountCards.length > 0" v-for="card in accountCards" :key="card.tokenId" class="pt-3">
            <card :cdata="card"/>
          </b-col>
        </b-row>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";
import ClickableTransaction from "../widgets/ClickableTransaction";
import ClickableAddress from "../widgets/ClickableAddress";

import Card from "../../components/widgets/Card";
export default {
  name: "account",
  components: { ClickableTransaction, ClickableAddress, Card },
  computed: {
    ...mapState(["account", "accountCards", "transfers", "cards"]),
    ...mapGetters(["findTx"])
  },
  created() {
    //FIXME in App.vue so prob not needed
    const loadData = function() {
      this.$store.dispatch(actions.LOAD_ACCOUNT_CARDS, {
        account: this.account
      });
    }.bind(this);

    this.$store.watch(() => this.$store.state.account, () => loadData());

    if (this.$store.state.account) {
      loadData();
    }
  }
};
</script>

<style lang="scss" scoped>
.card-body {
}

.card-img-top {
}
</style>
