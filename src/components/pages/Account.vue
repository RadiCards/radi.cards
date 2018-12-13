<template>
  <div class="container">
    <h2>
      My cards
      <span class="badge badge-primary">{{accountCards.length}}</span>
    </h2>
    <p>
      <clickable-address :eth-address="account"></clickable-address>
    </p>

    <div class="row mt-5" v-if="!accountCards || accountCards.length === 0">
      <div class="col text-center">
        <code>No cards yet - *Sad face*</code>
      </div>
    </div>

    <div class="row mt-2" v-else>
      <div class="col">
        <div class="card-slider" v-if="accountCards && accountCards.length > 0">
          <card v-for="item in accountCards" :key="item.tokenId" :cdata="item">{{item}}</card>
        </div>
      </div>
    </div>
  </div>
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
