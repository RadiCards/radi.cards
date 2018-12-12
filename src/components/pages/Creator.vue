<template>
  <div class="container">
    <!-- <h1 style=" margin-bottom:10px;">Card Foundry</h1>
    <p>Create your own unique card while supporting charity. Follow the steps below to compleate your card creation.</p>-->
    <form>
      <div role="tablist">
        <div v-if="this.step > 0" @click="goToStep(step-1)">&lt; Back</div>
        <div v-if="this.step == 0">
          <a href="/">&lt; Back</a>
        </div>

        <div class="summaryPreview">
          <div
            class="stepOnePreview"
            v-if="this.formData.card !== null && this.step > 0"
            @click="goToStep(0)"
          >
            <div class="m20">
              <h4 class="section__title">STEP ONE</h4>
            </div>
            <img class="m20" :src="this.formData.card.image">
            <div>
              <span class="selCard">Selected Card</span>
              <h5>{{this.formData.card.name}}</h5>
              <span class="artist">by {{this.formData.card.attributes.artist}}</span>
            </div>
          </div>

          <div
            class="stepOnePreview"
            @click="goToStep(1)"
            v-if="this.step > 1 && this.formData.benefactor !== null && this.formData.benefactor != undefined"
          >
            <div class="m20">
              <h4 class="section__title">STEP TWO</h4>
            </div>
            <img class="m20" :src="this.formData.benefactor.image">
            <div>
              <span class="selCard">Selected Charity</span>
              <h5>{{this.formData.benefactor.name}}</h5>
            </div>
          </div>
        </div>

        <div v-if="this.step == 0">
          <section class="section">
            <card v-if="this.card !== undefined" :cdata="this.formData.card"></card>

            <p>Enter your personal message for your card</p>
            <b-form-textarea
              id="textarea1"
              v-model="formData.message"
              placeholder="Happy holidays..."
              :rows="3"
              :max-rows="6"
            ></b-form-textarea>
            <br>
            <p>Recipient</p>
            <b-form-input
              type="text"
              class="field"
              id="recipient"
              v-model="formData.recipient"
              placeholder="0x0abc"
            />
          </section>
          <input
            type="button"
            @click="goToStep(1)"
            :disabled="this.formData.message === null || this.formData.recipient === null"
            value="NEXT"
          >
        </div>

        <div v-if="this.step == 1">
          <h4 class="section__title">STEP TWO</h4>
          <h2>Choose a project to support</h2>
          <section class="section">
            <p>From environmental protection to online privacy rights</p>
            <div class="charities" v-if="benefactors && benefactors.length > 0">
              <div v-for="item in benefactors" :key="item.address">
                <div @click="setBenefactor(item)">
                  <benefactor :benefactor="item"/>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-if="this.step == 2">
          <h4 class="section__title">STEP THREE</h4>
          <h2>Add my donation</h2>

          <section class="section">
            <p>I'd like to donate...</p>
            <div class="paymentPresets">
              <b-button @click="setDonationAmount(0.2)">0.2ETH</b-button>
              <b-button @click="setDonationAmount(0.3)">0.3ETH</b-button>
              <b-button @click="setDonationAmount(0.4)">0.4ETH</b-button>
            </div>
            <b-row class="pt-5 text-center">
              <b-col>
                <input
                  type="number"
                  class="field"
                  id="valueInETH"
                  v-model="formData.valueInETH"
                  placeholder="or enter a custom amount"
                >
              </b-col>
            </b-row>
          </section>
          <input
            type="button"
            @click="goToStep(3)"
            :disabled="this.formData.valueInEth > 0.01"
            value="PREVIEW CARD"
          >
        </div>

        <div v-if="this.step == 3">
          <section class="section">
            <p>Card Preview</p>
            <b-row class="text-center">
              <b-col>
                <card v-if="formData.card" :cdata="previewCardObject"/>
              </b-col>
            </b-row>
          </section>
          <b-button @click="giveBirth">gift this awesome card</b-button>
          <div class="form-group row" v-if="formData.errors.length">
            <div class="col-sm-4">
              <blockquote>
                <b>Please correct the following error(s):</b>
              </blockquote>
              <ul>
                <li v-for="error in formData.errors">{{ error }}</li>
              </ul>
            </div>
          </div>
          <!-- <input
            type="button"
            @click="goToStep(4)"
            :disabled="this.formData.valueInEth > 0.01"
            value="NEXT"
          >-->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as _ from "lodash";
import IPFS from "ipfs-api";
import Web3 from "web3";
import * as actions from "../../store/actions";
import ClickableTransaction from "../widgets/ClickableTransaction";
import Card from "../../components/widgets/Card";
import Benefactor from "../../components/widgets/Benefactor";
import Samplequote from "../../components/widgets/SampleQuote";
import router from "../../router";

const ipfs = IPFS("ipfs.infura.io", "5001", { protocol: "https" });

export default {
  name: "creator",
  components: { ClickableTransaction, Card, Benefactor, Samplequote },
  data() {
    return {
      params: {
        cardIndex: undefined
      },
      formData: {
        errors: [],
        card: {},
        valueInETH: null,
        recipient: null,
        benefactor: null,
        message: null
      },
      step: 0,
      status: "",
      response: {
        ipfsHash: null
      }
    };
  },
  computed: {
    ...mapState(["account", "uploadedHashs", "cards", "benefactors"]),
    previewCardObject() {
      return {
        ...this.formData.card,
        ...{
          message: this.formData.message,
          BenefactorIndex: this.formData.benefactor.id,
          giftAmount: this.formData.valueInETH
        }
      };
    },
    card() {
      var cIndex = this.$route.params.cardIndex;
      console.log(cIndex);

      for (var c = 0; c < this.cards.length; c++) {
        if (this.cards[c].cardIndex + "" === cIndex + "") {
          this.formData.card = this.cards[c];
          return this.cards[c];
        }
      }
    }
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    goToStep(pageNumber) {
      this.step = pageNumber;
    },
    setDonationAmount(amount) {
      console.log("setting amount");
      console.log(amount);
      this.formData.valueInETH = amount;
    },
    setBenefactor(benefactor) {
      this.formData.benefactor = benefactor;
      this.step = 2;
    },
    selectCard(card) {
      console.log("CARD SELECTED");
      console.log(card);
      if (this.formData.card === card) {
        this.formData.card = null;
        return;
      } else {
        this.formData.card = card;
        return;
      }
    },
    giveBirth: function() {
      this.checkForm();
      if (this.formData.errors.length === 0) {
        let recipient = this.formData.recipient;
        let valueInETH = this.formData.valueInETH + "";
        let benefactorIndex = this.formData.benefactor.id;
        let cardIndex = this.formData.card.cardIndex;
        let message = this.formData.message;
        let extra = "";

        this.$store.dispatch(actions.BIRTH, {
          recipient,
          benefactorIndex,
          cardIndex,
          message,
          extra,
          valueInETH
        });
      }
    },
    checkForm: function() {
      this.formData.errors = [];
      if (!this.formData.recipient) {
        this.formData.errors.push("Recipient is required.");
      } else if (!Web3.utils.isAddress(this.formData.recipient)) {
        this.formData.errors.push("Recipient not valid address.");
      }
      if (!this.formData.message) {
        this.formData.errors.push("Message is required.");
      }
      if (this.formData.card === {}) {
        this.formData.errors.push("Card is required.");
      }
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

.m20 {
  margin-right: 20px;
}

.paymentPresets {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}

.stepOnePreview {
  display: flex;
  border-bottom: 2px solid #c4c4c4;
  padding-bottom: 20px;
  margin-bottom: 20px;
  align-items: center;

  h4 {
    white-space: nowrap;
  }
  .selCard {
    font-family: Helvetica;
    line-height: normal;
    font-size: 14px;
  }
  .artist {
    font-family: Helvetica;
    line-height: normal;
    font-size: 14px;
  }

  h5 {
    font-family: Helvetica;
    line-height: normal;
    font-size: 14px;
    font-weight: bold;
  }

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
