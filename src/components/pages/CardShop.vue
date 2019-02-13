<template>
  <section class="section">
    <h2>{{ $t("m.cardShop")}}</h2>
    <p class="p--small">{{ $t("m.cardShopSub")}}</p>

    <div id="filter-selector">
      <div>
        <img id="dropdown" src="/static/icons/dropdown-arrow.svg">
        <span v-b-toggle.collapse>
          {{ optionText(selected) }}
        </span>
      </div>
      <b-collapse id="collapse">
        <div>
          <div class="option-text" v-for="option in options" @click="selectOption(option)" v-b-toggle.collapse>
            {{ option.text }}
        </div>
        </div>
      </b-collapse>
    </div>

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
import * as actions from "../../store/actions";

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
    ...mapState(["cards", "portisEthDenverLink"]),
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
        chineseNewYear: [3, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], //these cards are for chineseNY
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
    console.log("path");
    console.log(this.$route);
    if (this.$route.query.portisethdenverlink) {
      this.$store.dispatch(actions.PORTIS_DEEP_LINK);
    }
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
    },
    selectOption(option) {
      this.selected = option.value;
    },
    optionText(optionValue) {
      const option = this.options.find(o => o.value === optionValue);
      return option.text;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";
.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
}

.option-text {
  padding-right: 0.25em;
  color: #8B8B8B;
}

#collapse {
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.75);
  z-index: 1;
  width: 180px;
  background: white;
}

#dropdown {
  margin-bottom: 2px;
  margin-right: 4px;
}

#filter-selector {
  position: absolute;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: end;
  text-align: right;

  @include tabletAndDown() {
    right: 40px;
  }

  @include tabletAndUp() {
    right: 120px;
  }
}
</style>
