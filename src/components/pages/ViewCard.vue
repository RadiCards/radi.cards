<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <card :cdata="deepUrlCard"/>
      </div>
      <div class="col text-center">
        <img src="/static/icons/gift.png" class="pt-5" alt style="width: 4rem;">
        <p class="pt-4">RadiCards lets you send e-cards to your friends and family using crypto! 100% of the purchase goes to charities fighting for freedom around the world.</p>
      <hr class="pb-4">
      <router-link :to="{ name: 'cardshop' }" class="transferButton mt-2">Gift another card like this</router-link>
      </div>
    </div>
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
</style>
