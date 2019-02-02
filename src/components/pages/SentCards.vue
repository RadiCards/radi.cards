
<template>
  <div v-if="hasSentCards">
    <h1 class="mt-2">{{ $t("m.sentCards")}}</h1>View all the cards you have sent in the past. You can regenerate claimable links here if you have lost them and cancel outstanding gifts if they have not yet been claimed.
    <b-row no-gutters v-for="wallet in ephemeralWallets" :key="wallet.recipient">
      <b-col cols="12" class="pt-3">
        <sent-card :wallet="wallet"/>
      </b-col>
    </b-row>
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";
</style>
