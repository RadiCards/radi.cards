<template>
  <div
    v-if="cdata != undefined"
    :class="['card', this.classes, {'card--flippable': isFlippable}, {'card--flipped': isFlipped}]"
    @click="redirect"
  >
    <figure class="card__front" @click="flip" v-if="!transfer && !share">
      <div
        v-if="maxMinted"
        class="pb-4"
      >Maximum number of this card type minted. Can't select this card!</div>
      <div class="card__image" style="margin-bottom: 10px;">
        <img v-if="(cdata.image && cdata.image.length > 0)" :src="cdata.image" :alt="cdata.name">
        <img v-else src="/static/icons/radi-cards.svg" alt class="img--placeholder">
      </div>

      <figcaption>
        <div class="card__meta">
          <div class="row" variant="light" v-if="cdata.cardMaxQnty>0">
            <div class="col-6 pl-0">
              <p class="p--smallitalic mb-0">{{cdata.cardMinted}}/{{cdata.cardMaxQnty}} minted</p>
            </div>
            <div class="col-6 text-right pr-0">
              <div>
                <img src="/static/icons/specialedition.svg" alt>
              </div>
            </div>
          </div>
          <div class="row" variant="light" v-if="cdata.cardMaxQnty==0">
            <div class="col-6 pl-0">
              <p class="p--smallitalic mb-0">{{cdata.cardMinted}} minted</p>
            </div>
          </div>
          <div class="row">
            <div class="col-8 pl-0">
              <h4 class="title">{{ cdata.name }}</h4>
              <p class="creator" v-if="cdata.attributes">{{ cdata.attributes.artist }}</p>
            </div>
            <div class="col-4 text-right pr-0">
              {{(cdata.cardMinPrice /usdPrice).toFixed(2)}} ETH
              <p class="p--smallitalic">{{cdata.cardMinPrice}} USD</p>
            </div>
          </div>
          <p class="descr" v-if="cdata.description">{{ cdata.description }}</p>
          <b-badge variant="light" class="mt-2" v-if="company">{{company}}</b-badge>
        </div>
      </figcaption>

      <div class="help" v-if="isFlippable">
        <img src="/static/icons/flip.svg" alt>Flip
      </div>
    </figure>

    <figure
      class="card__front text-center"
      style="padding-top:50px"
      v-if="transfer && !getTransferStatus().length > 0 && !transferPending"
    >
      <h2 class="pb-2">Transfer Card</h2>
      <p class="descr">card ownership can be transferred to any ETH wallet address.</p>
      <hr>
      <p class="mb-2">Recipient wallet address:</p>
      <b-form-input type="text" class="field p-2" v-model="transferRecipient" placeholder/>

      <button @click="executeCardTransfer" class="transferButton mt-3">Transfer</button>
      <button @click="cancelTransfer" class="cancelButton mt-3">Cancel</button>
    </figure>

    <figure
      class="card__front text-center"
      style="padding-top:20px"
      v-if="transferPending && getTransferStatus()!=='FAILURE'"
    >
      <h4 class="pb-2">Transaction has been submitted...</h4>
      <p>This might take few seconds or minutes, depending on how favourable the Ethereum gods are.🤞</p>
      <br>
      <p>Best to not close this tab and go make some tea. Good things will happen.</p>
      <br>
    </figure>

    <figure
      class="card__front text-center"
      style="padding-top:50px"
      v-if="transfer && getTransferStatus()==='FAILURE'"
    >
      <h4>Oops...!</h4>

      <p>Something seems to have gone wrong and your card could not be transfered.</p>
      <br>
      <p>
        <strong>Please double-check your web3 wallet</strong> (Metamask, Coinbase Wallet, Status, Portis) to see the status of the transaction, or try again.
      </p>
    </figure>

    <figure class="card__front text-center" style="padding-top:20px" v-if="share">
      <h4 class="pb-2">Share your card</h4>
      <p>Generate a shareable link and send it to your friends and family so they can see your awesome card!</p>
      <hr>
      <a
        :href="'https://radi.cards/card/' + cdata.tokenId"
        target="_blank"
        class="btn btn--narrow btn--subtle"
        style="margin: 0.5rem 0.25rem 0 0;"
      >
        <strong>{{'radi.cards/card/' + cdata.tokenId}}</strong>
      </a>
      <a
        @click="copyToClipboard('https://radi.cards/card/' + cdata.tokenId)"
        target="_blank"
        class="btn btn--narrow btn--subtle"
        style="margin-top: 0.5rem;"
      >Copy</a>
      <button @click="cancelShare" class="cancelButton mt-3">Cancel</button>
    </figure>

    <figure
      class="card__back text-center"
      style="padding-top:50px"
      @click="flip"
      v-if="cdata.message"
    >
      <h6 v-html="cardMessageFormatted"></h6>
      <div class="descr" v-if="cdata.accountCreatedCard"></div>
      <div class="descr pt-2" v-if="this.$route.path.lastIndexOf('account') !== -1">
        <button @click="transferCard" class="transferButton">Transfer</button>
        <button @click="shareCard" class="cancelButton">Share</button>
      </div>
      <br>

      <div class="descr aligh">
        <strong v-if="cdata.tokenId">
          Token # {{cdata.tokenId}}
          <br>
        </strong>
        <div v-if="cdata.gifter">Creator:
          <clickable-address :eth-address="cdata.gifter"></clickable-address>
          <br>
        </div>
        <div v-if="cdata.giftAmount">
          Gift Amount: {{cdata.giftAmount}} {{(cdata.daiDonation)?'DAI':'ETH'}}
          <br>
        </div>
        <div v-if="cdata.donationAmount>0">
          Donation Amount: {{cdata.donationAmount}} {{(cdata.daiDonation)?'DAI':'ETH'}}
          <div v-if="cdata.BenefactorIndex!=0">
            Charity
            <strong>
              <a
                v-if="cdata.BenefactorIndex && benefactors"
                :href="benefactors[cdata.BenefactorIndex-1].website"
                target="_blank"
              >{{benefactors[cdata.BenefactorIndex-1].name}}</a>
            </strong>
          </div>
        </div>
      </div>
      {{transferedCardNotification}}
    </figure>
  </div>
</template>

<script>
/* global web3:true */

import { mapGetters, mapState } from "vuex";
import router from "../../router";
import * as actions from "../../store/actions";
import ClickableAddress from "./ClickableAddress";

export default {
  name: "card",
  components: { ClickableAddress },
  computed: {
    transferedCardNotification() {
      if (this.getTransferStatus() === "SUCCESS") {
        this.$emit("cardTransfered", this.transferRecipient);
      }
    },
    company() {
      let allCompanies = {
        QmQTexvhmvrWzfwrPkKeB7Nahpvgiv68Ciy5zE8Cr4Afp8:
          "Electronic Frontier Foundation",
        QmNRUjkackbZcnkxhjDcF81dAHDdNK9yuZShHPGCi4Eih4: "ETH Berlin",
        QmR2ydKGbXeLSeuNrXbKjoBvZLrb9BD9tnPD1ReqCPDES3: "ETH Berlin",
        QmcWtZHiCQNjZzoxVXpish8muQC9bi86RB7w2nAABNXKp8: "Centrifuge",
        QmNNSEZXNRXnDjVp2iz8e7B9Ufk2D7ikZwzrGHTUBWs1mf: "Astroledger",
        QmXLpmzS8myBfH8xh2e9Rfvn79PR8dGetpQzSFdaMWVik2: "Colony",
        QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph: "Colony"
      };
      let imageIPFSHash = this.cdata.image.substring(
        this.cdata.image.lastIndexOf("/") + 1,
        this.cdata.image.length
      );
      if (this.cdata.image.includes(imageIPFSHash)) {
        return allCompanies[imageIPFSHash];
      }
      return null;
    },
    cardMessageFormatted() {
      if (this.cdata.message) {
        return this.cdata.message.replace(/\r?\n/g, "<br />");
      } else {
        return null;
      }
    },
    ...mapState(["card", "benefactors", "usdPrice"]),
    ...mapGetters(["getTransferStatus"]),
    isFlippable: function() {
      return this.cdata.message && this.cdata.message.length > 0;
    }
  },
  props: {
    cdata: {
      type: Object
    },
    classes: {
      type: String
    }
  },

  data() {
    return {
      transfer: false,
      share: false,
      transferRecipient: "",
      isFlipped: false,
      transfered: false,
      transferPending: false,
      maxMinted: false
    };
  },

  methods: {
    copyToClipboard(text) {
      this.$copyText(text);
    },
    executeCardTransfer() {
      let recipient = this.transferRecipient;
      let tokenId = this.cdata.tokenId;
      this.$store.dispatch(actions.TRANSFER_CARD, { recipient, tokenId });
      this.transferPending = true;
    },
    cancelShare() {
      this.share = false;
      this.flip;
    },
    cancelTransfer() {
      this.transfer = false;
      this.flip;
    },
    transferCard() {
      this.transfer = true;
    },
    shareCard() {
      this.share = true;
    },
    redirect: function() {
      console.log(this.$route.path);
      if (
        !this.cdata.message &&
        this.$route.path.lastIndexOf("create") === -1
      ) {
        //check if another card can be minted
        if (
          this.cdata.cardMaxQnty === this.cdata.cardMinted &&
          this.cdata.cardMinted > 0
        ) {
          this.maxMinted = true;
        } else {
          var index = this.cdata.cardIndex;
          router.push({
            path: "create/" + index
          });
        }
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
@import "../../styles/mixins.scss";

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

  box-shadow: 0 0.25rem 1rem rgba($darkgray, 0.1);
  background: $white;
  border-radius: 0;
  border: 0;
  border-bottom-color: transparent;
  cursor: pointer;
  margin: 0 auto;

  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0.25rem 1.5rem rgba($darkgray, 0.2);
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

  &.card--gallery {
    @include tabletAndDown() {
      // width: calc(50vw - 1rem);
      // padding: $p_v/1.5 $p_h/2;

      figcaption {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .card__image {
        margin: -#{$p_v/1.5} -#{$p_h/2} #{$p_v/1.5};
      }
      .title {
        font-size: 1rem;
      }
      .creator {
        font-size: 0.75rem;
      }
      .descr {
        font-size: 0.75rem;
        line-height: 1rem;
      }
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
  }
  .creator {
    font-size: 0.9rem;
  }
  .descr {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: $gray;
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

  .flipper-mobile {
    @media (min-width: 1000px) {
      display: none;
    }
  }

  .card__meta {
    @media (min-width: 1000px) {
      padding-bottom: 0.5rem;
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
