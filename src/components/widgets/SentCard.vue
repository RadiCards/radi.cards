

<template>
  <div :class="['SentCard', {'isExpanded': expanded}]" v-if="wallet.card">
    <div class="SentCard__heading" @click="toggleDetail">
      <figure class="SentCard__img">
        <img v-if="wallet.card" :src="wallet.card.image">
      </figure>
      <h6 class="SentCard__name mt-2">You sent this card {{fromNow}}</h6>
      <p class="SentCard__value mt-2">
        Value {{wallet.card.giftAmount+wallet.card.donationAmount}}
        {{(wallet.card.daiDonation)?'DAI':'ETH'}}
      </p>

      <div
        :class="['btn btn--narrow btn--reveal btn--subtle', {'btn--arrow-down': !expanded, 'btn--arrow-up': expanded}]"
      >{{(expanded) ? 'less info' : 'more info'}}</div>
    </div>

    <div class="SentCard__detail">
      <div class="SentCard__text">
        <!-- v-if="expanded" -->
        <b-row no-gutters>
          <b-col cols="12" sm="12" lg="6">
            <card :cdata="wallet.card" class="mb-5"/>
          </b-col>
          <b-col cols="12" sm="12" lg="6">
            <div class="text-center" v-if="wallet.card.status==='Deposited'">
              <strong>This card's claimable link has no yet been claimed!</strong>
              You can cancel the link and get the funds back or regenerate the claimable link.
              <br>
              <br>
              <a
                @click="copyToClipboard('https://radi.cards/claim/' + wallet.privateKey)"
                target="_blank"
                class="btn btn--narrow btn--subtle mt-3"
              >Regenerate Claimable Link</a>
              <a target="_blank" class="btn btn--narrow btn--subtle mt-3">Cancel claimable link</a>
              <div class="text-center pt-2" v-if="linkGenerated">
                <a
                  :href="'https://radi.cards/claim/' + wallet.privateKey"
                  target="_blank"
                  class="claim-url"
                >Your gift claimable link</a>
                <p class="p--smallitalic">Claimable link copied to clipboard!</p>
              </div>
            </div>
            <div class="text-center pt-5" v-if="wallet.card.status==='Claimed'">
              <strong>This card's claimable link has already been claimed!</strong>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
/* global web3:true */

import { mapState } from "vuex";
import router from "../../router";
import Card from "./Card";
import ClickableAddress from "../widgets/ClickableAddress";

import moment from "moment";

export default {
  name: "SentCard",
  components: { Card, ClickableAddress },
  date() {
    return {};
  },
  props: {
    wallet: {
      type: Object
    }
  },
  computed: {
    ...mapState(["ClickableAddress", "SentCards", "cards"]),
    // cdata() {
    //   return this.cards[this.wallet.cardIndex];
    // }
    fromNow() {
      console.log("A");
      console.log(this.wallet.time);
      let timeObject = null;
      if (this.wallet) {
        timeObject = moment(this.wallet.time, "Do MMMM YYYY, h:mm:ss a");
        console.log("OBJ");
        console.log(timeObject);
      }
      return timeObject.startOf("minute").fromNow();
    }
  },
  methods: {
    copyToClipboard(text) {
      this.$copyText(text);
      this.linkGenerated = true;
    },
    selectSentCard() {
      this.$emit("SentCardSelected");
    },
    toggleDetail() {
      this.expanded = !this.expanded;
    }
  },
  data() {
    return {
      status: "",
      expanded: false,
      linkGenerated: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";

.SentCard {
  // margin: 0 -2rem;
  transition: all 0.2s ease-in-out;

  @include tabletAndUp() {
    margin: 0;
  }

  &:hover,
  &.isExpanded {
    background: $white;
    box-shadow: 0 0.25rem 1rem rgba($darkgray, 0.1);
  }

  &__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    cursor: pointer;
  }
  &__img {
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  &__name {
    margin-left: 1rem;
    margin-right: auto;
    font-weight: bold;
  }

  &__value {
    margin-right: auto;
    // font-weight: bold;
  }

  &__text {
    padding: 1rem;

    @include tabletAndUp() {
      padding: 1rem 1rem 1rem 6rem;
    }

    p + a {
      display: inline-block;
      margin-top: 0.5rem;
    }
  }

  &__detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.6s ease-in-out, opacity 0.6s ease-in-out;
    opacity: 0;
  }
  &.isExpanded .SentCard__detail {
    max-height: 70vh;
    opacity: 1;
  }

  & + .SentCard {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .smallSentCard {
    zoom: 0.5;
    -moz-transform: scale(0.5);
    width: 9rem;
    height: 100%;
    min-height: 6rem;
  }
}
</style>
