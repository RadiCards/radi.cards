<template>
  <section class="section">
    <h2>{{ $t("m.cardShop")}}</h2>
    <p class="p--small">{{ $t("m.cardShopSub")}}</p>
    <b-form-group>
      <b-form-radio-group
        v-if="window.width>720"
        id="btnradios1"
        buttons
        v-model="selected"
        :options="options"
        name="radiosBtnDefault"
      />
      <div class="text-center" v-if="window.width<720">
        <b-form-radio-group
          stacked
          id="btnradios1"
          buttons
          v-model="selected"
          :options="options"
          name="radiosBtnDefault"
        />
      </div>
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
        { text: "Ethereum community", value: "ethereumCommunity" },
        { text: "Chinese Lunar New Year", value: "chineseNewYear" },
        { text: "Christmas & New Year", value: "christmas" }
      ],
      window: {
        width: 0,
        height: 0
      }
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
        ethereumCommunity: [
          8,
          19,
          20,
          30,
          31,
          47,
          48,
          49,
          50,
          53,
          54,
          56,
          57,
          58
        ],
        chineseNewYear: [3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], //these cards are for chineseNY
        christmas: [1, 2, 51, 52, 55] //these cards are for christmas
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
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
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
