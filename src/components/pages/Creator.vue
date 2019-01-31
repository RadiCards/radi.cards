<template>
  <div class="container">
    <!-- <h1 style=" margin-bottom:10px;">Card Foundry</h1>
    <p>Create your own unique card while supporting charity. Follow the steps below to compleate your card creation.</p>-->
    <div v-if="account==null">
      <h4>No web3 wallet could be detected! 🧐</h4>
      <p class="pt-2">
        In order to create a new radi card you require a web3 browser and account with Ether. We recommend you try
        <a
          target="__blank"
          href="https://metamask.io"
        >Meta Mask</a>,
        <a target="__blank" href="https://status.im">Status</a>,
        <a target="__blank" href="https://trustwallet.com/">Trust Wallet</a>,
        <a target="__blank" href="https://wallet.coinbase.com/">Coinbase Wallet</a> or
        <a target="__blank" href="https://wallet.portis.io/">Portis</a>! You can still view all other functionality within the website without one.
      </p>
    </div>
    <form v-if="account!=null && account != undefined">
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
              <h4 class="section__title">STEP ONE</h4>
              <h4>Customise card</h4>
              <p>Choose recipient & message</p>
            </div>

            <span class="input-label">Add a message (This will be visible on the blockchain)</span>
            <b-form-textarea
              id="textarea"
              class="field"
              v-model="formData.message"
              placeholder="max 128 characters"
              :rows="3"
              :max-rows="6"
            ></b-form-textarea>

            <br>

           <p>Choose one of the sending options</p>
            <div class="fieldgroup--radio">

              <!-- Option 1 -->
              <div :class="['field field--radio', {'isSelected': formData.sendOptions === 'wallet'}]">
                <input
                  type="radio"
                  id="sendToWallet"
                  value="wallet"
                  v-model="formData.sendOptions"
                >
                <label for="sendToWallet" class="field--radio__content">
                  <span v-if="formData.sendOptions !== 'wallet'" class="pretext">
                    Want to transfer the NFT?
                  </span>
                  <h6>Send to another ETH wallet address</h6>

                  <div v-if="formData.sendOptions === 'wallet'" class="sendOptionSelectedContent">
                    <input
                      type="text"
                      placeholder="0x..."
                      class="field form-control"
                      v-model="formData.recipient"
                    >
                    <br>
                    <p class="p--small">Transfer the card directly; the web3 way</p>
                  </div>

                </label>
              </div>

              <!-- Option 2 -->
              <div :class="['field field--radio', {'isSelected': formData.sendOptions === 'email'}]">

                <input type="radio" id="sendToEmail" value="email" v-model="formData.sendOptions">

                <label for="sendToEmail" class="field--radio__content">
                  <span v-if="formData.sendOptions !== 'email'" class="pretext">
                    Don’t have a recipient wallet?
                  </span>
                  <h6>Send to email address</h6>
                  <div v-if="formData.sendOptions === 'email'" class="sendOptionSelectedContent">
                    <input
                      type="email"
                      placeholder="Email address"
                      class="field form-control"
                      v-model="formData.email"
                    >
                    <p class="p--small">This will create the card in your own wallet, create a link to it and send it via email.</p>
                    <span class="input-label">Your wallet:</span>
                    <br>
                    <div class="field field--disabled">{{account}}</div>
                  </div>
                </label>

              </div>

              <!-- Option 3 -->
              <div :class="['field field--radio', {'isSelected': formData.sendOptions === 'personal'}]">
                <input
                  type="radio"
                  id="sendToPersonal"
                  value="personal"
                  v-model="formData.sendOptions"
                >
                <label for="sendToPersonal" class="field--radio__content">
                  <span v-if="formData.sendOptions !== 'personal'" class="pretext">
                    Want to share the link manually?
                  </span>
                  <h6>Send to own wallet</h6>
                  <div v-if="formData.sendOptions === 'personal'" class="sendOptionSelectedContent">
                    <p class="p--small">This will create the card in your own wallet, create a link to it and lets you share it however you want.</p>
                    <span class="input-label">Your wallet:</span>
                    <br>
                    <div class="field field--disabled">{{account}}</div>
                  </div>
                </label>
              </div>

            </div>

            <br>
            <input
              type="button"
              class="button button--fullwidth"
              :disabled="checkMessageAndReceiver()"
              @click="handleMessageAndReceiver()"
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
              <span class="input-label">Or enter a custom amount</span>
              <input
                type="number"
                class="field field--full"
                id="valueInETH"
                v-model="formData.valueInETH"
                placeholder="0.02ETH"
                min="0.02"
              >
              <div
                v-if="formData.valueInETH"
                class="usdLabel"
              >Equals to ${{(formData.valueInETH * usdPrice).toFixed(2)}}</div>
            </div>
            <span
              class="info"
            >Every card has a base transactional price of 0.02 ETH, that’s why there is a minimum.</span>
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
              <br>
              <br>Message (displayed on the back of the card):
              <br>
              <br>
              <h5 v-html="cardMessageFormatted"></h5>
              <br>
              <br>
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
                <strong>check your web3 wallet</strong> (Metamask, Coinbase Wallet, Status, Portis) if you haven't already confirmed this action.
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
            <p>Best to not close this tab and go make some tea.</p>
            <p>Good things will happen.</p>
            <br>
            <p v-if="getGiftingStatus(formData.recipient, formData.card.cardIndex).tx">
              You can view the transaction of Etherscan
              <a
                class="a--external"
                :href="etherscanBase + '/tx/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tx"
                target="_blank"
              >here</a>
            </p>
          </div>
        </div>

        <!-- STATUS: SUCCESS -->
        <div
          class="section step step--twocol step5"
          v-if="(step === 3 && getGiftingStatus(formData.recipient, formData.card.cardIndex).status === 'SUCCESS')"
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

            <h4>You rock!</h4>

            <p>We've successfully sent an awesome radicard to
              <clickable-address :eth-address="formData.recipient"></clickable-address>
            </p>
            <br>

            <div class="share-box">
              <h2>Share with others</h2>
              <br>
              <span class="subtext">email this radicard to your friend</span>
              <br>
              <div class="email-field">
                <input
                  type="email"
                  class="field form-control"
                  style="margin-bottom:0px;"
                  v-model="formData.email"
                >
                <mailto-link
                  v-if="formData.email && formData.email.length > 0"
                  :email="formData.email"
                  subject="You've received a Radi.Card!"
                  :body-text="'Hi there!\n\nSomeone sent you a radicard!\n\nTo see it, go here:\nhttps://radi.cards/card/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId + '\n\n\n100% income (after gas fee) goes to https://eff.org or other charity of your choice.\nSpread the joy and send crypto eCards to your friends at https://radi.cards.\n\n----------------------------------\n\nDo you know that your radicard is a Non-Fungible Token?\nThis means that it is unique and only created just for you.\n\nHowever, you can only keep your card (token) in an Ethereum wallet.\nSo go install one from MetaMask, Trustwallet, MyEtherwallet or Coinbase wallet.\nOnce you have your own wallet, ask your friend to transfer the token to you. EZ!'"

                >send</mailto-link>
              </div>
              <span class="subtext">send this radicard via a chat app by copy and paste this link</span>
              <div class="copy-field">
                <a
                  id="copyfield"
                  :href="'https://radi.cards/card/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId"
                  target="_blank"
                  class="field form-control"
                >
                  <strong>{{'radi.cards/card/' + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId}}</strong>
                </a>
                <div
                  @click="copyToClipboard('https://radi.cards/card/' + + getGiftingStatus(formData.recipient, formData.card.cardIndex).tokenId)"
                  target="_blank"
                >copy</div>
              </div>
            </div>

            <div>
              <router-link
                @click="this.$store.dispatch(actions.RESET_TRANSFER_STATUS);"
                :to="{ name: 'cardshop' }"
                style="width:100%; margin-top:20px;"
                class="btn pick"
              >Pick another card and keep rocking</router-link>
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
              <card v-if="formData.card" :cdata="previewCardObject"/>
            </div>
          </div>

          <div class="step__info">
            <h4>Oops...!</h4>

            <p>Something seems to have gone wrong and your card could not be created.</p>
            <br>
            <p class="pb-3">
              <strong>Please double-check your web3 wallet</strong> (Metamask, Coinbase Wallet, Status, Portis) to see the status of the transaction, or try again.
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
                class="a--external"
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
import ClickableAddress from "../widgets/ClickableAddress";
import Card from "../../components/widgets/Card";
import Benefactor from "../../components/widgets/Benefactor";
import Samplequote from "../../components/widgets/SampleQuote";
import MailtoLink from "../../components/widgets/MailtoLink";
import { AssertionError } from "assert";

export default {
  name: "creator",
  components: {
    ClickableTransaction,
    Card,
    Benefactor,
    Samplequote,
    MailtoLink,
    ClickableAddress
  },
  data() {
    return {
      formData: {
        errors: [],
        card: {},
        valueInETH: null,
        recipient: null,
        benefactor: null,
        message: null,
        email: null
      },
      step: 0,
      walletVisible: false,
      response: {
        ipfsHash: null
      }
    };
  },
  computed: {
    ...mapState([
      "etherscanBase",
      "account",
      "uploadedHashs",
      "cards",
      "benefactors",
      "usdPrice"
    ]),
    ...mapGetters(["getGiftingStatus"]),
    cardMessageFormatted() {
      return this.formData.message.replace(/\r?\n/g, "<br />");
    },
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
    checkMessageAndReceiver() {
      if (!this.formData.message) {
        return true;
      }

      if (
        this.formData.sendOptions === "wallet" &&
        Web3.utils.isAddress(this.formData.recipient)
      ) {
        return false;
      }

      if (this.formData.sendOptions === "personal") {
        return false;
      }

      if (this.formData.sendOptions === "email" && this.formData.email) {
        return false;
      }

      return true;
    },
    handleMessageAndReceiver() {
      if (this.checkMessageAndReceiver()) {
        return;
      }

      if (this.formData.sendOptions !== "wallet") {
        this.formData.recipient = this.account;
      }
      this.goToStep(1);
    },
    copyToClipboard(text) {
      this.$copyText(text);
    },
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
      if (this.formData.card === card) {
        this.formData.card = null;
      } else {
        this.formData.card = card;
      }
    },
    giveBirth: function(event) {
      event.preventDefault();

      this.checkForm();
      if (this.formData.errors.length === 0) {
        var recipient = this.account;
        if (this.formData.sendOptions === "wallet") {
          recipient = this.formData.recipient;
        }
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
      if (this.formData.sendOptions === "wallet" && !this.formData.recipient) {
        this.formData.errors.push("Recipient is required.");
      } else if (
        this.formData.sendOptions === "wallet" &&
        !Web3.utils.isAddress(this.formData.recipient)
      ) {
        this.formData.errors.push("Recipient not valid address.");
      }
      if (this.formData.valueInETH < 0.02) {
        this.formData.errors.push("Value must be at least 0.02ETH");
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

.pick {
  background: rgba(196, 196, 196, 0.2);
  color: black;
  line-height: normal;
  font-size: 18px;
  font-weight: bold;
}

.share-box {
  background: white;
  padding: 20px;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);

  .field {
    background: rgba(196, 196, 196, 0.15);
  }

  .subtext {
    line-height: normal;
    font-size: 14px;

    color: $black;

    opacity: 0.3;
  }

  .email-field {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    a {
      color: white;
      background: black;
      padding: 0px 15px;
      line-height: 38px;
    }
  }

  .copy-field {
    display: flex;
    flex-direction: row;
    border: 1px solid black;

    #copyfield {
      background: rgba(196, 196, 196, 0.15) !important;
      border: 0;
    }

    div {
      color: $gray;
      background: rgba(196, 196, 196, 0.15);
      padding: 9px 10px;
      height: 100%;
      border: 0px;
      margin: 0px;
    }
  }
}

.card-selected {
  margin-top: -1rem;
  transition: all 0.2s ease-in-out;
}

.info {
  line-height: normal;
  font-size: 12px;

  color: $black;
}

.input-label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  margin-top: 0.675rem;
  display: inline-block;
  color: $black;
}
input, textarea {
  margin-bottom: 1rem;
}
// textarea {
//   border: 1px solid $black;

//   &::placeholder {
//     text-align: right;
//     text-align-last: right;
//     vertical-align: bottom;
//   }
// }

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

.usdLabel {
  background: rgba(196, 196, 196, 0.3);
  padding: 10px;
  line-height: normal;
  font-size: 15px;
  display: inline-block;
  color: $black;
}
</style>
