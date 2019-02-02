<template>
  <section class="section">
    <h2 style="margin-bottom: 0.5rem;">
      {{ $t("m.myCards")}}
      <span class="badge badge-primary">{{accountCards.length}}</span>
    </h2>
    <clickable-address :eth-address="account"></clickable-address>

    <b-row class="mt-5 mb-5 transferedCard" v-if="cardTransferOccured">
      <b-col col="2">
        <img src="/static/icons/success.png" alt style="width: 5rem;">
      </b-col>
      <b-col col="10">
        <h2>Successfully Transfered!</h2>
        <p>Card was transfered to address {{transferedAddress}}</p>
      </b-col>
    </b-row>

    <b-row class="mt-5" v-if="!accountCards || accountCards.length === 0">
      <div class="col text-center">
        <img src="/static/icons/radi-cards.svg" alt class="img--placeholder">
        <br>
        <br>
        <h4>{{ $t("m.aww")}}</h4>
        <br>
        <p
          style="max-width: 24rem; margin: 0 auto;"
        >{{ $t("m.notYetSent")}}</p>
        <br>
        <router-link :to="{ name: 'cardshop' }" class="btn">{{ $t("m.sendEthHongbao")}}</router-link>
      </div>
    </b-row>
    <div v-else>
      <div v-if="hasPremiumCards">
        <h3 class="mt-2">{{ $t("m.premiumCards")}}</h3>
        <b-row no-gutters>
          <b-col
            cols="12"
            sm="12"
            md="6"
            lg="4"
            v-if="card.cardMaxQnty > 0"
            v-for="card in accountCards"
            :key="card.tokenId"
            class="pt-3"
          >
            <card classes="card" @cardTransfered="handelCardTransfered" :cdata="card"/>
          </b-col>
        </b-row>
        <hr>
      </div>
      <div v-if="hasStandardCards">
        <h3 class="mt-2">{{ $t("m.standardCards")}}</h3>

        <b-row no-gutters>
          <b-col
            cols="12"
            sm="12"
            md="6"
            lg="4"
            v-if="card.cardMaxQnty == 0"
            v-for="card in accountCards"
            :key="card.tokenId"
            class="pt-3"
          >
            <card classes="card" @cardTransfered="handelCardTransfered" :cdata="card"/>
          </b-col>
        </b-row>
        <hr>
      </div>
    </div>
    <div v-if="hasSentCards">
      <h1 class="mt-2">{{ $t("m.sentCards")}}</h1>
      <b-row no-gutters v-for="wallet in ephemeralWallets" :key="wallet.recipient">
        <b-col cols="12" class="pt-3">
          <sent-card :wallet="wallet"/>
        </b-col>
      </b-row>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";
import ClickableTransaction from "../widgets/ClickableTransaction";
import ClickableAddress from "../widgets/ClickableAddress";
import SentCard from "../widgets/SentCard";
import Card from "../../components/widgets/Card";
export default {
  name: "account",
  components: { ClickableTransaction, ClickableAddress, Card, SentCard },
  data() {
    return {
      cardTransferOccured: false,
      transferedAddress: null
    };
  },
  computed: {
    ...mapState([
      "account",
      "accountCards",
      "transfers",
      "cards",
      "ephemeralWallets"
    ]),
    hasPremiumCards() {
      let hasCard = false;
      if (this.accountCards) {
        this.accountCards.forEach(function(card) {
          if (card.cardMaxQnty > 0) {
            hasCard = true;
          }
        });
      }
      return hasCard;
    },
    hasStandardCards() {
      let hasCard = false;
      if (this.accountCards) {
        this.accountCards.forEach(function(card) {
          if (card.cardMaxQnty === 0) {
            hasCard = true;
          }
        });
      }
      return hasCard;
    },
    hasSentCards() {
      return this.ephemeralWallets.length > 0;
    }
  },
  mounted() {
    this.$store.dispatch(actions.RESET_TRANSFER_STATUS);
  },
  methods: {
    handelCardTransfered(cardTransfered) {
      this.cardTransferOccured = true;
      this.transferedAddress = cardTransfered;
      this.$store.dispatch(actions.RESET_TRANSFER_STATUS);
    }
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
@import "../../styles/variables.scss";
.transferedCard {
  top: 10;
  left: 100;
  width: 100%;
  height: 100%;
  background: $greylightest;
}
</style>
