<template>
  <div class="container">
    <!-- <h1 style=" margin-bottom:10px;">Card Foundry</h1>
    <p>Create your own unique card while supporting charity. Follow the steps below to compleate your card creation.</p>-->
    <form>
      <div role="tablist">
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
              <figure class="preview-step__img">
                <img :src="this.formData.card.image" alt="this.formData.card.name">
              </figure>
              <div class="preview-step__text" v-if="this.formData.card">
                <span class="selCard">Selected Card</span>
                <h5>{{this.formData.card.name}}</h5>
                <span class="artist">by {{this.formData.card.attributes.artist}}</span>
              </div>
              <div
                class="btn btn--reveal btn--narrow"
                v-if="!getGiftingStatus(formData.recipient, formData.card.cardIndex).status"
              >
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
              <figure class="preview-step__img">
                <img :src="this.formData.benefactor.image" alt="this.formData.benefactor.name">
              </figure>
              <div class="preview-step__text">
                <span class="selCard">Selected Charity</span>
                <h5>{{this.formData.benefactor.name}}</h5>
              </div>
              <div
                v-if="this.step > 2 && formData.valueInETH !== null && formData.valueInETH != undefined"
              >
                Donation:
                <strong>{{formData.valueInETH}}</strong> ETH
              </div>
              <div
                class="btn btn--reveal btn--narrow"
                v-if="!getGiftingStatus(formData.recipient, formData.card.cardIndex).status"
              >
                <img src="/static/icons/Edit.svg">
              </div>
            </div>
          </div>
        </div>

        <div class="section step step--twocol step1" v-if="step === 0">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="this.formData.card"></card>
          </div>

          <div class="step__info">
            <div class="step__title">
              <h4>Customise card</h4>
              <p>Choose recipient & message</p>
            </div>

            <br>

            <span class="inputLabel">Add recipient wallet address</span>
            <b-form-input
              type="text"
              class="field"
              id="recipient"
              v-model="formData.recipient"
              placeholder
            />

            <div
              v-if="!walletVisible"
              class="btn btn--subtle btn--small btn--arrow-down"
              @click="walletVisible = true"
            >Recipient doesn’t have a wallet address?</div>
            <div :class="['wallet', {'isVisible' : walletVisible}]" v-if="account">
              <h6>Recipient doesn’t have a wallet address?</h6>
              <div class="wallet__collapse btn--arrow-up" @click="walletVisible = false"></div>
              <p
                class="p--small"
              >No problem! Send the card to yourself and give them the preview link. You can also transfer it later!</p>
              <div class="wallet__actions">
                <span class="text">Your wallet: {{account}}</span>
                <div
                  @click="formData.recipient = account"
                  class="btn btn--small btn--outline"
                >Use my wallet</div>
              </div>
            </div>

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
            <input
              type="button"
              class="button button--fullwidth"
              @click="this.$store.dispatch(actions.RESET_TRANSFER_STATUS);goToStep(1)"
              value="next"
            >
          </div>
        </div>

        <div class="section step step2" v-if="step === 1">
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

        <div class="section step step2" v-if="step === 2">
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
                min="0"
              >
            </div>
            <span
              class="info"
            >Every card has a base transactional price of 0.01 ETH, that’s why there is a minimum.</span>
          </section>
          <input type="button" @click="goToStep(3)" class="button" value="preview card">
        </div>

        <div
          class="section step step--twocol step3"
          v-if="step == 3 && (!getGiftingStatus(formData.recipient, formData.card.cardIndex).status || getGiftingStatus(formData.recipient, formData.card.cardIndex).status==='TRIGGERED')"
        >
          <div class="step__card">
            <div class="centered">
              <card v-if="formData.card" :cdata="previewCardObject"/>
            </div>
          </div>

          <div class="step__info">
            <h4>Preview your radicard</h4>

            <span class="detailsText">
              Recipient: {{formData.recipient}}
              <br>
              <br>Message (displayed on the back of the card):
              <br>
              <h4 v-html="cardMessageFormatted"></h4>
              <br>
            </span>
            
            <button
              class="button"
              @click="giveBirth"
              v-if="getGiftingStatus(formData.recipient, formData.card.cardIndex).status !== 'TRIGGERED'"
            >gift this awesome card</button>

            <div class="form-group row" v-if="formData.errors.length">
              <div class="col-sm-12">
                <blockquote>
                  <b>Please correct the following error(s):</b>
                </blockquote>
                <ul>
                  <li v-for="error in formData.errors">{{ error }}</li>
                </ul>
              </div>
            </div>

            <div
              v-if="getGiftingStatus(formData.recipient, formData.card.cardIndex).status === 'TRIGGERED'"
              class="transaction-in-progress"
            >
              <h6 style="margin-bottom: 0.5rem;">Card is being created...</h6>
              <p>
                Please
                <strong>check your web3 wallet</strong> (Metamask, Coinbase Wallet, Status) if you haven't already confirmed this action.
              </p>
            </div>
          </div>
        </div>

        <!-- STATUS: PENDING -->
        <div
          class="section step step--twocol step4"
          v-if="step === 3 && getGiftingStatus(formData.recipient, formData.card.cardIndex).status === 'SUBMITTED'"
        >
          <div class="step__card">
            <div class="centered">
              <card v-if="formData.card" :cdata="previewCardObject"/>
            </div>
          </div>

          <div class="step__info">
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

            <br>

            <h4>Card is being created...</h4>
            <p>This might take few seconds or minutes, depending on how favourable the Ethereum gods are.🤞</p>
            <br>
            <p>Best to not close this tab and go make some tea. Good things will happen.</p>
            <br>
            <p v-if="getGiftingStatus(formData.recipient, formData.card.cardIndex).tx">
              You can view the transaction of Etherscan
              <a
                :href="etherscanBase + '/tx/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tx"
                target="_blank"
              >here</a>
            </p>
          </div>
        </div>

        <!-- STATUS: SUCCESS -->
        <div
          class="section step step--twocol step5"
          v-if="step === 3 && getGiftingStatus(formData.recipient, formData.card.cardIndex).status === 'SUCCESS'"
        >
          <div class="step__card">
            <div class="centered">
              <card v-if="formData.card" :cdata="previewCardObject"/>
            </div>
          </div>

          <div class="step__info">
            <img src="/static/icons/success.png" alt style="width: 5rem;">
            <br>
            <br>

            <h4>Thank you!</h4>

            <p>We’ve successfully sent an awesome radicard to {{account}}</p>
            <br>

            <p v-if="getGiftingStatus(formData.recipient, formData.card.cardIndex).tx">
              You can view the transaction of Etherscan
              <a
                :href="etherscanBase + '/tx/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tx"
                target="_blank"
              >here</a>
            </p>
            <p>Directly share this card via this link:</p>
            <div class="row">
              <div class="col">
                <a
                  :href="'https://radi.cards/card/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId"
                  target="_blank"
                  class="btn btn--narrow btn--subtle"
                  style="margin: 0.5rem 0.25rem 0 0;"
                >
                  <strong>{{'radi.cards/card/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId}}</strong>
                </a>
                <a
                  @click="copyToClipboard('https://radi.cards/card/' + + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId)"
                  target="_blank"
                  class="btn btn--narrow btn--subtle"
                  style="margin-top: 0.5rem;"
                >Copy</a>
              </div>
            </div>
            <div class="row pt-3">
              <div class="col">
                <router-link
                  @click="this.$store.dispatch(actions.RESET_TRANSFER_STATUS);"
                  :to="{ name: 'cardshop' }"
                  class="btn"
                >Send another card</router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- STATUS: FAILED -->
        <div
          class="section step step--twocol step6"
          v-if="step === 3 && getGiftingStatus(formData.recipient, formData.card.cardIndex).status === 'FAILURE'"
        >
          <div class="step__card">
            <div class="centered">
              <card v-if="formData.card" :cdata="formData.card"/>
            </div>
          </div>

          <div class="step__info">
            <h4>Oops...!</h4>

            <p>Something seems to have gone wrong and your card could not be created.</p>
            <br>
            <p class="pb-3">
              <strong>Please double-check your web3 wallet</strong> (Metamask, Coinbase Wallet, Status) to see the status of the transaction, or try again.
            </p>

            <router-link
              @click="this.$store.dispatch(actions.RESET_TRANSFER_STATUS);"
              :to="{ name: 'cardshop' }"
              class="btn"
            >Start over</router-link>
            <button class="btn" @click="giveBirth">Retry Transaction</button>
            <p v-if="getGiftingStatus(formData.recipient, formData.card.cardIndex).tx">
              You can view the transaction of Etherscan
              <a
                :href="etherscanBase + '/tx/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tx"
                target="_blank"
              >here</a>
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as _ from "lodash";
import Web3 from "web3";
import * as actions from "../../store/actions";
import ClickableTransaction from "../widgets/ClickableTransaction";
import Card from "../../components/widgets/Card";
import Benefactor from "../../components/widgets/Benefactor";
import Samplequote from "../../components/widgets/SampleQuote";

export default {
  name: "creator",
  components: { ClickableTransaction, Card, Benefactor, Samplequote },
  data() {
    return {
      formData: {
        errors: [],
        card: {},
        valueInETH: null,
        recipient: null,
        benefactor: null,
        message: null
      },
      step: 0,
      walletVisible: false,
      response: {
        ipfsHash: null
      }
    };
  },
  computed: {
    ...mapState(["etherscanBase"]),
    ...mapGetters(["getGiftingStatus"]),
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
    },
    hasStep1Data() {
      if (this.formData.message === null || this.formData.recipient === null) {
        return true;
      } else if (
        this.formData.message.length < 1 ||
        this.formData.recipient.length < 1
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    copyToClipboard(text) {
      this.$copyText(text);
    },
    handelBenefactorSelected(item) {
      this.setBenefactor(item);
    },
    goToStep(pageNumber) {
      if (
        !this.getGiftingStatus(
          this.formData.recipient,
          this.formData.card.cardIndex
        ).status
      ) {
        this.step = pageNumber;
      }
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
      } else {
        this.formData.card = card;
      }
    },
    giveBirth: function() {
      event.preventDefault();

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

.paymentPresets {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}

.wallet {
  position: relative;
  display: none;
  padding: 0.75rem 1rem;
  border-radius: 0;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.05);

  &.isVisible {
    display: block;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    @include tabletAndUp() {
      flex-direction: row;
    }
  }

  &__collapse {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.75rem;
    cursor: pointer;
  }

  .btn {
    align-self: flex-end;
  }
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
    width: 3rem;
    height: 3rem;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}

// Step Content
.step--twocol {
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
