
<template>
  <div v-if="hasSentCards">
    <h1 class="mt-2">{{ $t("m.sentCards")}}</h1>{{ $t("m.sentCards2")}}
    <b-row no-gutters v-for="wallet in ephemeralWallets" :key="wallet.recipient">
      <b-col cols="12" class="pt-3">
        <sent-card :wallet="wallet" v-if="wallet.card"/>
      </b-col>
    </b-row>
    <div
      v-if="hasPendingCards"
    >You have pending transactions for claimable links. Please wait a minute for these to be mined and you will then be able to view them above.</div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SentCard from "../widgets/SentCard";

export default {
  components: { SentCard },
  name: "QRCodeImage",
  props: ["link"],
  computed: {
    ...mapState(["ephemeralWallets"]),
    hasSentCards() {
      return this.ephemeralWallets.length > 0;
    },
    hasPendingCards() {
      let ephemeralWalletsLoaded = 0;
      this.ephemeralWallets.forEach(function(wallet) {
        if (wallet.card != null) {
          ephemeralWalletsLoaded++;
        }
      });
      return this.ephemeralWallets.length > ephemeralWalletsLoaded;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";
</style>
