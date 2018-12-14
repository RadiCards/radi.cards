<template>
  <div
    v-if="cdata != undefined"
    :class="['card', {'card--flippable': isFlippable}, {'card--flipped': isFlipped}]"
    @click="redirect"
  >
    <figure class="card__front" @click="flip" v-if="!transfer">
      <div class="card__image">
        <img v-if="(cdata.image && cdata.image.length > 0)" :src="cdata.image" :alt="cdata.name">
        <img v-else src="/static/icons/radi-cards.svg" alt class="img--placeholder">
      </div>

      <figcaption>
        <div class="card__meta">
          <h4 class="title">{{ cdata.name }}</h4>
          <p class="creator" v-if="cdata.attributes">{{ cdata.attributes.artist }}</p>
        </div>
        <!-- <div class="card__value" v-if="cdata.giftAmount">
          <div class="badge">
            <img src="/static/icons/shopping-cart.svg">
            {{cdata.giftAmount}} ETH
          </div>
        </div> -->
      </figcaption>

      <div v-if="cdata.description">
        <p class="descr">{{ cdata.description }}</p>
      </div>

      <div v-if="!cdata.description">
        <p class="descr"> </p>
      </div>

      <div class="help" v-if="isFlippable">
        <img src="/static/icons/flip.svg" alt>Flip
      </div>
    </figure>
    <figure class="card__front text-center" v-if="transfer">
      <h2 class="pb-2">Transfer Card</h2>
      <p>Send your Radi card to any web3 address.</p>
      <hr>
      <p class="mb-3">Recipiant Address:</p>
      <b-form-input type="text" class="field p-2" v-model="transferRecipient" placeholder/>

      <button @click="executeCardTransfer" class="transferButton mt-3">Transfer</button>
      <button @click="cancelTransfer" class="cancelButton mt-3">Cancel</button>
    </figure>

    <figure
      class="card__back text-center"
      style="padding-top:120px"
      @click="flip"
      v-if="cdata.message"
    >
      <h3>
        <strong>{{cdata.message}}</strong>
      </h3>
      <hr>
      <p class="descr">
        Your donation goes to
        <strong>
          <a
            v-if="cdata.BenefactorIndex"
            :href="benefactors[cdata.BenefactorIndex-1].website"
            target="_blank"
          >{{benefactors[cdata.BenefactorIndex-1].name}}</a>
        </strong>
      </p>
      <div
        class="descr"
        v-if="cdata.accountCreatedCard && cdata.accountCreatedCard"
      >Your web3 account created this card!</div>
      <div class="descr pt-2" v-if="this.$route.path.lastIndexOf('account') !== -1">
        <button @click="transferCard" class="transferButton">Transfer Card</button>
      </div>
      <!-- </p> -->
    </figure>
  </div>
</template>

<script>
/* global web3:true */

import { mapState } from "vuex";
import router from "../../router";
import * as actions from "../../store/actions";

export default {
  name: "card",

  computed: {
    ...mapState(["card", "benefactors"]),
    isFlippable: function() {
      return this.cdata.message && this.cdata.message.length > 0;
    }
  },
  props: {
    cdata: {
      type: Object
    }
  },

  data() {
    return {
      transfer: false,
      transferRecipient: "",
      isFlipped: false
    };
  },

  methods: {
    executeCardTransfer() {
      let recipient = this.transferRecipient;
      let tokenId = this.cdata.tokenId;
      console.log("Transfer card", recipient);
      this.$store.dispatch(actions.TRANSFER_CARD, { recipient, tokenId });
    },
    cancelTransfer() {
      this.transfer = false;
      this.flip;
    },
    transferCard() {
      console.log("transfer clicked");
      this.transfer = true;
    },
    redirect: function() {
      if (
        this.$route.path.lastIndexOf("create") === -1 &&
        this.$route.path.lastIndexOf("account") === -1
      ) {
        var index = this.cdata.cardIndex;
        router.push({
          path: "create/" + index
        });
      }
    },
    flip: function(event) {
      this.isFlipped = !this.isFlipped;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

// Card
.card {
  $p_v: 1rem;
  $p_h: 1.5rem;

  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
  width: 18rem;
  max-width: 18rem;
  margin-right: 1rem;
  padding: $p_v $p_h;

  box-shadow: 0 0.25rem 1rem rgba($black, 0.1);
  background: $white;
  border-bottom-color: transparent;
  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0.25rem 1.5rem rgba($black, 0.2);
    border-bottom: none;
  }
  &:not(.card--flippable):hover {
    transform: translateY(-2px);
  }

  &--flippable {
    cursor: e-resize;
    cursor: alias;
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;

    // Flip effect
    &.card--flipped {
      transform: rotateY(-180deg);
      transform-style: preserve-3d;
    }
  }

  &__front,
  &__back {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  figure {
    display: block;
    width: 100%;
  }

  &__image {
    flex: 1;
    margin: -#{$p_v} -#{$p_h} $p_v;
    background: $greylight;

    img {
      display: block;
      width: 100%;
      max-width: 100%;
      height: 100%;
      min-height: 12rem;
      object-fit: cover;
      object-position: center;
    }
    .img--placeholder {
      opacity: 0.1;
      display: flex;
      justify-content: center;
      text-align: center;
    }
  }

  figcaption {
    display: flex;
  }

  &__meta {
    flex: 1;
  }

  &__value {
    flex: 0;
  }

  // Content
  .title {
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .creator {
    font-size: 0.9rem;
  }
  .descr {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: $gray;
  }

  .badge {
    display: flex;
    align-items: center;
    margin-right: -$p_h;
    padding: 0.5rem;
    background: $black;
    color: $white;
    white-space: nowrap;
    font-weight: bold;

    img {
      width: 0.875rem;
      margin-right: 0.25rem;
    }
  }

  .help {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex: 0;
    align-items: center;
    margin: 0 -#{$p_h/2} -#{$p_v/2} 0;

    font-size: 0.75rem;
    opacity: 0.2;

    &:hover {
      opacity: 0.4;
    }

    img {
      width: 0.875rem;
      margin-right: 0.25rem;
    }
  }

  // Card back side
  &__back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: $p_v $p_h;
    background: $greylightest;
    transform: rotateY(180deg);

    cursor: w-resize;
  }

  // Card transfer side
  &__transfer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: $p_v $p_h;
    background: #f5f5f5;

    cursor: default;
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

  .cancelButton {
    background: white;
    color: black;
    font-family: Helvetica;
    line-height: normal;
    font-size: 16px;
    padding: 15px;
    border: 1px solid black;
  }
}
</style>
