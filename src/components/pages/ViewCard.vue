<template>
  <div class="container">
    <b-row>
      <b-col cols="12" md="6" style="display: flex; justify-content: center; padding-left: 2rem;">
        <card :cdata="deepUrlCard"/>
        <img src="/static/images/red-arrow.svg" class="dl-1">
        <span class="cheeky-comment">click on the card to see the hidden message.</span>
      </b-col>
      <b-col cols="12" md="6" class="text-center">
        <img src="/static/icons/gift.png" class="pt-5" alt style="width: 4rem;">
        <p class="pt-4 pb-4">RadiCards lets you send e-cards to your friends and family using crypto! 100% of the purchase goes to charities fighting for freedom around the world.</p>
      <router-link :to="{ name: 'cardshop' }" class="btn mt-2">Gift another card like this</router-link>
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
    ...mapState(["deepUrlCard"])
  },
  mounted() {
    let tokenId = this.$route.params.id;
    this.$store.dispatch(actions.LOAD_DEEP_URL_CARD, { tokenId });
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
.dl-1{
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
  width: 12%;

}


</style>
