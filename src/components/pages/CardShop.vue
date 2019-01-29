<template>
  <section class="section">
    <h2>{{ $t("m.cardShop")}}</h2>
    <p class="p--small">{{ $t("m.cardShopSub")}}</p>
    <br>
    <br>
    <br>
    <h3>{{ $t("m.premiumCards")}}</h3>
    <br>
    <b-row no-gutters v-if="shuffledCards && shuffledCards.length > 0">
      <b-col
        cols="6"
        sm="6"
        lg="4"
        v-for="card in shuffledCards"
        :key="card.tokenId"
        class="pt-3"
        v-if="card.cardMaxQnty > 0"
      >
        <card :cdata="card" classes="card--gallery"/>
      </b-col>
    </b-row>
    <br>
    <br>
    <hr>
    <br>
    <br>
    <br>
    <h3>{{ $t("m.standardCards")}}</h3>
    <br>
    <b-row no-gutters v-if="shuffledCards && shuffledCards.length > 0">
      <b-col
        cols="6"
        sm="6"
        lg="4"
        v-for="card in shuffledCards"
        :key="card.tokenId"
        class="pt-3"
        v-if="card.cardMaxQnty == 0"
      >
        <card :cdata="card" classes="card--gallery"/>
      </b-col>
    </b-row>

    <div v-else class="loading-container">
      <div class="loading-spinner">
        <div class="loading-spinner-inner">
          <div class="holder">
            <div class="box"></div>
          </div>
          <div class="holder">
            <div class="box"></div>
          </div>
          <div class="holder">
            <div class="box"></div>
          </div>
        </div>
      </div>
      <span class="text">{{ $t("m.gettingCards")}}</span>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import Card from "../../components/widgets/Card";

export default {
  name: "creator",
  components: { Card },
  data() {
    return {};
  },
  computed: {
    ...mapState(["cards"]),
    shuffledCards() {
      if (this.cards) {
        return this.cards.sort(function() {
          return 0.5 - Math.random();
        });
      }
    }
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";
.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
}
</style>
