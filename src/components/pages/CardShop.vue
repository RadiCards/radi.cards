<template>
  <section class="section">
    <h2>{{ $t("m.cardShop")}}</h2>
    <p class="p--small">{{ $t("m.cardShopSub")}}</p>
    <b-form-group>
      <b-form-radio-group
        id="btnradios1"
        buttons
        v-model="selected"
        :options="options"
        name="radiosBtnDefault"
      />
    </b-form-group>
    <br>
    <h3>{{ $t("m.premiumCards")}}</h3>
    <br>
    <b-row no-gutters v-if="shuffledCards && shuffledCards.length > 0">
      <b-col
        cols="12"
        sm="12"
        md="6"
        lg="4"
        v-for="card in shuffledCards"
        :key="card.tokenId"
        class="pt-3"
        v-if="card.cardMaxQnty > 0  && card.cardActive && selectedGroup.includes(card.cardIndex)"
      >
        <card :cdata="card" classes="card"/>
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
        cols="12"
        sm="12"
        md="6"
        lg="4"
        v-for="card in shuffledCards"
        :key="card.tokenId"
        class="pt-3"
        v-if="card.cardMaxQnty == 0  && card.cardActive && selectedGroup.includes(card.cardIndex)"
      >
        <card :cdata="card" classes="card"/>
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
import _ from "lodash";

export default {
  name: "creator",
  components: { Card },
  data() {
    return {
      selected: "all",
      options: [
        { text: "All", value: "all" },

        { text: "Chinese New Year", value: "chineseNewYear" },
        { text: "EthDenver", value: "ethDenver" },
        { text: "Christmas", value: "christmas" },
        { text: "Other", value: "other" }
      ]
    };
  },
  computed: {
    ...mapState(["cards"]),
    shuffledCards() {
      if (this.cards) {
        return this.cards.sort(function() {
          return 0.5 - Math.random();
        });
      }
    },
    selectedGroup() {
      let cardFilter = {
        chineseNewYear: _.range(1, 30), //cards 1 to 29 are chineseNY cards
        ethDenver: [],
        christmas: [1, 2], //card 1 and 2 are christmas
        other: _.range(30, 59).concat([3, 4, 20]) //cards 3, 4, 20 and 30 to 58 are other
      };

      if (this.selected === "all") {
        return Array.apply(null, { length: this.cards.length }).map(
          Number.call,
          Number
        );
      } else {
        return cardFilter[this.selected];
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
