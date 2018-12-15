<template>
  <div class="container">
    <!-- <h1 style=" margin-bottom:10px;">Card Foundry</h1>
    <p>Create your own unique card while supporting charity. Follow the steps below to compleate your card creation.</p>-->
    <form>
      <div role="tablist">
        <div
          class="btn btn--reveal btn--narrow btn--arrow-left"
          style="margin-left: -0.75rem;"
          v-if="this.step > 0"
          @click="goToStep(step-1)"
        >Back</div>
        <div v-if="this.step == 0">
          <!-- <router-link :to="{ name: 'cardshop' }">&lt; Back</router-link> -->
        </div>

        <div class="preview">
          <div
            class="preview-step"
            v-if="this.formData.card !== null && this.step > 0"
            @click="goToStep(0)"
          >
            <h4 class="section__title">
              <img src="/static/icons/Check.svg"> STEP ONE
            </h4>

            <div class="preview-step__content">
              <img class="preview-step__img" :src="this.formData.card.image">
              <div class="preview-step__text" v-if="this.formData.card">
                <span class="selCard">Selected Card</span>
                <h5>{{this.formData.card.name}}</h5>
                <span class="artist">by {{this.formData.card.attributes.artist}}</span>
              </div>
              <div class="btn btn--reveal btn--narrow">
                <img src="/static/icons/Edit.svg">
              </div>
            </div>
          </div>

          <div
            class="preview-step"
            @click="goToStep(1)"
            v-if="this.step > 1 && this.formData.benefactor !== null && this.formData.benefactor != undefined"
          >
            <h4 class="section__title">
              <img src="/static/icons/Check.svg"> STEP TWO
            </h4>

            <div class="preview-step__content">
              <img class="preview-step__img" :src="this.formData.benefactor.image">
              <div class="preview-step__text">
                <span class="selCard">Selected Charity</span>
                <h5>{{this.formData.benefactor.name}}</h5>
              </div>
              <div class="btn btn--reveal btn--narrow">
                <img src="/static/icons/Edit.svg">
              </div>
            </div>
          </div>
        </div>

        <div class="section step step1" v-if="this.step == 0">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="this.formData.card"></card>
          </div>

          <div class="step__info">
            <div class="step__title">
              <h4>Customise details</h4>
              <p>Send this card to any ETH wallet address</p>
            </div>

            <section class="section">
              <span class="myWallet">Your wallet: {{account}}</span>
              <span class="inputLabel">Add recipient wallet address</span>
              <b-form-input
                type="text"
                class="field"
                id="recipient"
                v-model="formData.recipient"
                placeholder
              />

              <h6 class="c-blue">Recipient doesn’t have a wallet address?</h6>
              <p
                class="p--small c-blue"
              >No problem! Send the card to yourself and give them the preview link. You can also transfer it later!</p>

              <span class="inputLabel">Add a message (This will be visible on the blockchain)</span>
              <b-form-textarea
                id="textarea"
                class="field"
                v-model="formData.message"
                placeholder="max 128 characters"
                :rows="3"
                :max-rows="6"
              ></b-form-textarea>
              <br>
            </section>
            <input
              type="button"
              class="button button--fullwidth"
              @click="goToStep(1)"
              :disabled="this.formData.message === null || this.formData.recipient === null"
              value="next"
            >
          </div>
        </div>

        <div class="section step step2" v-if="this.step == 1">
          <div class="step__title">
            <h4 class="section__title">STEP TWO</h4>
            <h4>Choose a project you wish to support</h4>
            <p>Your donations go directly to charities of your choice</p>
          </div>

          <section class="section">
            <div class="charities" v-if="benefactors && benefactors.length > 0">
              <benefactor
                v-for="item in benefactors"
                :key="item.address"
                :benefactor="item"
                @benefactorSelected="handelBenefactorSelected(item)"
              />
            </div>
          </section>
        </div>

        <div class="section step step2" v-if="this.step == 2">
          <div class="step__title">
            <h4 class="section__title">STEP THREE</h4>
            <h4>Add your donation</h4>
            <p>I’d like to donate...</p>
          </div>

          <section class="section">
            <div class="paymentPresets">
              <button
                :class="['button button--outline', {'isSelected' : formData.valueInETH == 0.2}]"
                @click="setDonationAmount(0.2)"
              >0.2ETH</button>
              <button
                :class="['button button--outline', {'isSelected' : formData.valueInETH == 0.3}]"
                @click="setDonationAmount(0.3)"
              >0.3ETH</button>
              <button
                :class="['button button--outline', {'isSelected' : formData.valueInETH == 0.4}]"
                @click="setDonationAmount(0.4)"
              >0.4ETH</button>
            </div>
            <div>
              <span class="inputLabel">Or enter a custom amount</span>
              <input
                type="number"
                class="field full"
                id="valueInETH"
                v-model="formData.valueInETH"
                placeholder="0.01ETH"
              >
            </div>
            <span
              class="info"
            >Every card has a base transactional price of 0.01 ETH, that’s why there is a minimum.</span>
          </section>
          <input type="button" @click="goToStep(3)" class="button" value="preview card">
        </div>

        <div class="section step step3" v-if="this.step == 3">
          <div class="step__card">
            <div class="centered">
              <card v-if="formData.card" :cdata="previewCardObject"/>
            </div>
          </div>

          <div class="step__info">
            <div class="sectionTitle">
              <h6>Preview your radicard</h6>
              <p>Send this card to any ETH wallet address</p>
            </div>

            <span class="detailsText">
              Donation: {{formData.valueInETH}} ETH
              <br>
              Recipient: {{formData.recipient}}
              <br>
              <br>Message (display in the back of the card):
              <br>
              <h4 v-html="cardMessageFormatted"></h4>
              <br>
            </span>
            
            <button
              v-if="status != 'GIVING BIRTH'"
              class="button"
              @click="giveBirth"
            >gift this awesome card</button>

            <div class="form-group row" v-if="formData.errors.length && status != 'GIVING BIRTH'">
              <div class="col-sm-12">
                <blockquote>
                  <b>Please correct the following error(s):</b>
                </blockquote>
                <ul>
                  <li v-for="error in formData.errors">{{ error }}</li>
                </ul>
              </div>
            </div>

            <div v-if="status == 'GIVING BIRTH'" class="transaction-in-progress">
              <h6 style="margin-bottom: 0.5rem;">Card is being created...</h6>
              <p>
                Please
                <strong>check your web3 wallet</strong> (Metamask, Coinbase Wallet, Status) if you haven't already confirmed this action.
              </p>
            </div>
          </div>
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
      status: "IDLE",
      response: {
        ipfsHash: null
      }
    };
  },
  computed: {
    cardMessageFormatted() {
      return this.formData.message.replace(/\r?\n/g, "<br />");
    },
    ...mapState(["account", "uploadedHashs", "cards", "benefactors"]),
    previewCardObject() {
      return {
        ...this.formData.card,
        ...{
          message: this.cardMessageFormatted,
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
    handelBenefactorSelected(item) {
      this.setBenefactor(item);
    },
    goToStep(pageNumber) {
      this.step = pageNumber;
    },
    setDonationAmount(amount) {
      event.preventDefault();
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
      event.preventDefault();

      this.status = "GIVING BIRTH";

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
      if (this.formData.message && this.formData.message.length > 128) {
        this.formData.errors.push("Message is too long! Max 128 characters.");
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
@import "../../styles/mixins.scss";

.card-selected {
  margin-top: -1rem;
  transition: all 0.2s ease-in-out;
}

.full {
  width: 100%;
}

.info {
  line-height: normal;
  font-size: 12px;

  color: $black;
}

.inputLabel {
  line-height: normal;
  font-size: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
  display: inline-block;
  color: $black;
}

input {
  border: 1px solid $black;
  margin-bottom: 20px;
}
textarea {
  border: 1px solid $black;

  &::placeholder {
    text-align: right;
    text-align-last: right;
    vertical-align: bottom;
  }
}

.sectionTitle {
  // margin-top: 40px;
  // font-size: 22px;
  // margin-bottom: 40px;
}

.paymentPresets {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}

.myWallet {
  padding: 0.75rem 1rem;
  border-radius: 1.5rem !important;
  font-size: 12px;
  display: block;
  background: #f3f3f3;
}

// Steps preview (top)
.preview-step {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 -2rem;
  padding: 0.75rem 0.5rem 0.75rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;

  @include tabletAndUp() {
    flex-direction: row;
    align-items: center;
    margin: 0;
    padding: 0.5rem 0;
  }

  .section__title {
    margin-right: 1rem;
  }

  &__content {
    display: flex;
    flex: 1;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &__text {
    margin-left: 1rem;
    margin-right: auto;
  }
  .selCard {
    line-height: normal;
    font-size: 14px;
  }
  .artist {
    line-height: normal;
    font-size: 14px;
  }

  h5 {
    line-height: normal;
    font-size: 14px;
    font-weight: bold;
  }

  .preview-step__img {
    width: 50px;
    height: 50px;
  }
}

// Step Content
.step1,
.step3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .step__card {
    padding-left: 1rem;
    margin-bottom: 2rem;
  }

  @include tabletAndUp() {
    flex-direction: row;
    justify-content: stretch;
    align-items: flex-start;

    .step__card {
      margin-right: 1rem;
    }
    .step__info {
      margin-left: 1rem;
    }
    .step__title {
      margin-top: 0;
    }
  }
}

.centered {
  display: flex;
  justify-content: center;
  align-content: center;
}

.donationButton {
  background: white;
  color: black;
  line-height: normal;
  font-size: 16px;
  padding: 15px;
  border: 1px solid black;

  &.clicked {
    background: black;
    color: white;
    border: 0;
  }
}

.transaction-in-progress {
  width: 100%;

  background: $yellow;
  padding: 1rem;
}
</style>
