<template>
  <div class="container">
    <b-row>
      <b-col cols="12" md="6" style="display: flex; justify-content: center; padding-left: 2rem;">
        <card :cdata="deepUrlCard"/>
        <img src="/static/images/red-arrow.svg" class="dl-1">
        <span class="cheeky-comment">click on the card to see the hidden message.</span>
      </b-col>
      <b-col cols="12" md="6" class="text-center">
        <h3
          v-if="deepUrlCard.status=='Deposited' && account!=null"
        >Transferring card to your unlocked wallet! 🎉</h3>
        <h3
          v-if="deepUrlCard.status=='Deposited' && account==null"
        >You've opened a claimable card! But you don't have a web3 browser. Install metamask to claim the card or ImToken to transfer the card and content to your wallet.</h3>
        <h3 v-if="deepUrlCard.status=='Claimed'">This link has already been claimed 🙁</h3>
        <img src="/static/icons/gift.png" class="pt-5" alt style="width: 4rem;">
        <p
          class="pt-4 pb-4"
          v-if="deepUrlCard.giftAmount>0"
        >This card has a gift crypto gift associated with it!</p>
        <p
          v-if="deepUrlCard.daiDonation"
        >A total of {{deepUrlCard.giftAmount}} DAI was sent with the card!</p>
        <p
          v-if="!deepUrlCard.daiDonation"
        >A total of {{deepUrlCard.giftAmount}} ETH was sent with the card!</p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Card from "../../components/widgets/Card";
import router from "../../router";
import * as actions from "../../store/actions";

export default {
  name: "creator",
  components: { Card },
  data() {
    return {
      dispatchCardCount: 0,
      dispatchCardDeep: 0
    };
  },
  computed: {
    ...mapState(["deepUrlCard", "account"])
  },
  mounted() {
    let privateKey = this.$route.params.pk;
    console.log("privateKey", privateKey);
    this.$store.dispatch(actions.CLAIM_GIFT, { privateKey });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
}
.transferButton {
  background: #000000;
  font-family: Helvetica;
  line-height: normal;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  padding: 15px;
  border: 1px solid black;
}

.cheeky-comment {
  position: absolute;
  top: 60%;
  left: 82%;
  width: 9rem;
  transform: rotate(6deg);
  font-weight: bold;
}
.dl-1 {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
  width: 12%;
}
</style>
