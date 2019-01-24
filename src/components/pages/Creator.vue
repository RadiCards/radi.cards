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
        <a target="__blank" href="https://token.im/download?locale=en-US">imToken Wallet</a>,
        <a target="__blank" href="https://status.im">Status</a>,
        <a target="__blank" href="https://trustwallet.com/">Trust Wallet</a>,
        <a target="__blank" href="https://wallet.coinbase.com/">Coinbase Wallet</a> or
        <a target="__blank" href="https://app.portis.io/">Portis</a>! You can still view all other functionality within the website without one.
      </p>
    </div>
    <form v-if="account!=null && account != undefined">
      <div role="tablist">
        <div class="section step step--twocol step1" v-if="step === 0">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="this.formData.card"></card>
          </div>
          <div class="step__info">
            <div class="step__title">
              <h4>Customise card</h4>
              <p>Add message &amp; recipient details</p>
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

            <br>
            <input
              type="button"
              class="button button--fullwidth"
              :disabled="!formData.message"
              @click="goToStep(1)"
              value="NEXT"
            >
          </div>
        </div>

        <div class="section step step--twocol step2" v-if="step === 1">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="previewCardObject"></card>
          </div>
          <div class="flex-column">
            <div class="step__title">
              <h4>Add money</h4>
              <p>Add ether or DAI to your hongbao</p>
            </div>

            <div class="fieldgroup--radio column">
              <!-- Option 1 -->
              <div :class="['field field--radio', {'isSelected': formData.currency === 'ETH'}]">
                <input type="radio" id="selectETH" value="ETH" v-model="formData.currency">
                <label for="selectETH" class="field--radio__content">
                  <p class="p--smallitalic">Topup your hongbao with cryptocurrency</p>
                  <span v-if="formData.currency !== 'ETH'" class="pretext">Send ETH</span>

                  <div v-if="formData.currency === 'ETH'" class="sendOptionSelectedContent">
                    <p class="p--bold">Send ETH</p>
                    <input
                      type="number"
                      class="field form-control"
                      v-model="formData.valueInETH"
                      step="0.1"
                      :min="premuimCardInformation.minInEth"
                    >
                    <p class="p--smallitalic">≈ {{equivalentFiatCost}}USD = X RMB</p>
                    <div class="paymentPresets">
                      <button
                        :class="['button button--outline', {'isSelected' : formData.valueInETH == 0.2}]"
                        @click="setDonationAmount(0.2)"
                      >0.2 ETH</button>
                      <button
                        :class="['button button--outline', {'isSelected' : formData.valueInETH == 0.5}]"
                        @click="setDonationAmount(0.5)"
                      >0.5 ETH</button>
                      <button
                        :class="['button button--outline', {'isSelected' : formData.valueInETH == 1}]"
                        @click="setDonationAmount(1)"
                      >1 ETH</button>
                    </div>
                  </div>
                </label>
              </div>

              <div :class="['field field--radio', {'isSelected': formData.currency === 'DAI'}]">
                <input type="radio" id="selectDAI" value="DAI" v-model="formData.currency">
                <label for="selectDAI" class="field--radio__content">
                  <p class="p--smallitalic">Topup your hongbao with stable cryptocurrency</p>
                  <span v-if="formData.currency !== 'DAI'" class="pretext">Send DAI</span>

                  <div v-if="formData.currency === 'DAI'" class="sendOptionSelectedContent">
                    <p class="p--bold">Send DAI</p>
                    <input
                      type="number"
                      class="field form-control"
                      v-model="formData.valueInDAI"
                      :step="1.0"
                      :min="premuimCardInformation.minInDai"
                    >

                    <div class="paymentPresets">
                      <button
                        :class="['button button--outline', {'isSelected' : formData.valueInDAI == 25}]"
                        @click="setDonationAmount(25)"
                      >25 DAI</button>
                      <button
                        :class="['button button--outline', {'isSelected' : formData.valueInDAI == 60}]"
                        @click="setDonationAmount(60)"
                      >60 DAI</button>
                      <button
                        :class="['button button--outline', {'isSelected' : formData.valueInDAI == 120}]"
                        @click="setDonationAmount(120)"
                      >120 DAI</button>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <p class="margin">Donate to charity of your choice</p>
            <select class="margin red-drop" v-model="formData.benefactor">
              <option v-for="item in benefactors" :value="item" v-bind:key="item.name">{{item.name}}</option>
            </select>
            <br>
            <vue-slider
              class="margin"
              ref="slider"
              v-bind="donationSliderOptions"
              v-model="formData.percentage"
              formatter="{value}%"
            ></vue-slider>
            <br>
            <br>
            <input
              type="button"
              class="button button--fullwidth"
              :disabled="!validateDonationMethod()"
              @click="goToStep(2)"
              value="NEXT"
            >
            <p v-if="formData.currency === 'ETH' && formData.valueInETH > ethBalance">You don't have enough ETH to send that much! Your ETH balance is {{parseFloat(ethBalance).toFixed(3)}}</p>
            <p v-if="formData.currency === 'DAI' && formData.valueInDAI > daiBalance">You don't have enough DAI to send that much! Your DAI balance is {{parseFloat(daiBalance).toFixed(3)}}</p>
          </div>
        </div>

        <div class="section step step--twocol step2" v-if="step === 2">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="this.formData.card"></card>
          </div>
          <div class="flex-column">
            <div class="step__title">
              <h4>Add money</h4>
              <p>Add ether or DAI to your hongbao</p>
            </div>

            <div class="fieldgroup--radio column">
              <!-- QR -->
              <div :class="['field field--radio', {'isSelected': formData.sendingMethod === 'QR'}]">
                <input type="radio" id="selectQR" value="QR" v-model="formData.sendingMethod">
                <label for="selectQR" class="field--radio__content">
                  <p class="p--smallitalic">Works with WeChat, Twitter, Facebook</p>
                  <span v-if="formData.sendingMethod !== 'QR'" class="pretext">Send via QR code</span>
                  <div v-if="formData.sendingMethod === 'QR'" class="sendOptionSelectedContent">
                    <p class="p--bold">Send via QR code</p>
                  </div>
                </label>
              </div>

              <!-- ETH -->
              <div
                :class="['field field--radio', {'isSelected': formData.sendingMethod === 'ETH'}]"
              >
                <input type="radio" id="selectETH" value="ETH" v-model="formData.sendingMethod">
                <label for="selectETH" class="field--radio__content">
                  <p class="p--smallitalic">Send hongbao to a recipient right away</p>
                  <span
                    v-if="formData.sendingMethod !== 'ETH'"
                    class="pretext"
                  >Send to another ETH wallet</span>
                  <div v-if="formData.sendingMethod === 'ETH'" class="sendOptionSelectedContent">
                    <p class="p--bold">Send to another ETH wallet</p>
                    <input
                      type="text"
                      placeholder="0x..."
                      class="field form-control"
                      v-model="formData.recipient"
                    >
                  </div>
                </label>
              </div>

              <!-- Self -->
              <div
                :class="['field field--radio', {'isSelected': formData.sendingMethod === 'Self'}]"
              >
                <input type="radio" id="selectSelf" value="Self" v-model="formData.sendingMethod">
                <label for="selectSelf" class="field--radio__content">
                  <p class="p--smallitalic">Send hongbao to a recipient at a later time</p>
                  <span
                    v-if="formData.sendingMethod !== 'Self'"
                    class="pretext"
                  >Send hongbao to a recipient at a later time</span>
                  <div v-if="formData.sendingMethod === 'Self'" class="sendOptionSelectedContent">
                    <p class="p--bold">Send to my own ETH wallet address</p>
                    <p>Your wallet:</p>
                    <p class="p--smallitalic small-account">{{account}}</p>
                  </div>
                </label>
              </div>
            </div>

            <input
              type="button"
              class="button button--fullwidth"
              :disabled="!validateSendingMethod()"
              @click="goToStep(3)"
              value="PREVIEW HANGOBAO"
            >
          </div>
        </div>
        {{getGiftingStatus(account, formData.card.cardIndex).status}}
        <!-- CONFIRMATION PAGE -->
        <div
          class="section step step--twocol step2"
          v-if="step === 3 && !getGiftingStatus(account, formData.card.cardIndex).status"
        >
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="previewCardObject"></card>
          </div>
          <div class="flex-column">
            <div class="step__title">
              <h4>Your hongbao is ready!</h4>
              <p>Now send this hongbao to your friends!</p>

              <p>HERE you can find all the stored data to wire in:</p>
              <pre>{{formData}}</pre>

              <input
                type="button"
                class="button button--fullwidth"
                @click="giveBirth"
                value="GENERATE HANGOBAO"
              >
            </div>
          </div>
        </div>

        <!-- STATUS: SUBMITTED -->
        <div
          class="section step step--twocol step4"
          v-if="step === 3 && getGiftingStatus(account, formData.card.cardIndex).status === 'TRIGGERED'"
        >
          <div class="step__card">
            <div class="centered">
              <card v-if="formData.card" :cdata="previewCardObject"/>
            </div>
          </div>

          <div class="step__info">
            <br>

            <h4>Transaction has been triggered!</h4>
            <p>Please accept the transaction in your web3 provider, such as metamask</p>
          </div>
        </div>

        <!-- STATUS: SUBMITTED -->
        <div
          class="section step step--twocol step4"
          v-if="step === 3 && getGiftingStatus(account, formData.card.cardIndex).status === 'SUBMITTED'"
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
            <p v-if="getGiftingStatus(account, formData.card.cardIndex).tx">
              You can view the transaction of Etherscan
              <a
                class="a--external"
                :href="etherscanBase + '/tx/' + getGiftingStatus(account, formData.card.cardIndex).tx"
                target="_blank"
              >here</a>
            </p>
          </div>
        </div>

        <!-- STATUS: SUCCESS -->
        <div
          class="section step step--twocol step5"
          v-if="(step === 3 && getGiftingStatus(account, formData.card.cardIndex).status === 'SUCCESS')"
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
                  :body-text="'Hi there!\n\nSomeone sent you a radicard!\n\nTo see it, go here:\nhttps://radi.cards/card/' + getGiftingStatus(account, formData.card.cardIndex).tokenId + '\n\n\n100% income (after gas fee) goes to https://eff.org or other charity of your choice.\nSpread the joy and send crypto eCards to your friends at https://radi.cards.\n\n----------------------------------\n\nDo you know that your radicard is a Non-Fungible Token?\nThis means that it is unique and only created just for you.\n\nHowever, you can only keep your card (token) in an Ethereum wallet.\nSo go install one from MetaMask, Trustwallet, MyEtherwallet or Coinbase wallet.\nOnce you have your own wallet, ask your friend to transfer the token to you. EZ!'"
                >send</mailto-link>
              </div>
              <span class="subtext">send this radicard via a chat app by copy and paste this link</span>
              <div class="copy-field">
                <a
                  id="copyfield"
                  :href="'https://radi.cards/card/' + getGiftingStatus(account, formData.card.cardIndex).tokenId"
                  target="_blank"
                  class="field form-control"
                >
                  <strong>{{'radi.cards/card/' + getGiftingStatus(account, formData.card.cardIndex).tokenId}}</strong>
                </a>
                <div
                  @click="copyToClipboard('https://radi.cards/card/' + + getGiftingStatus(account, formData.card.cardIndex).tokenId)"
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
          v-if="step === 3 && getGiftingStatus(account, formData.card.cardIndex).status === 'FAILURE'"
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
            <p v-if="getGiftingStatus(account, formData.card.cardIndex).tx">
              You can view the transaction of Etherscan
              <a
                class="a--external"
                :href="etherscanBase + '/tx/' + getGiftingStatus(account, formData.card.cardIndex).tx"
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
import vueSlider from "vue-slider-component";

export default {
  name: "creator",
  components: {
    ClickableTransaction,
    Card,
    Benefactor,
    Samplequote,
    MailtoLink,
    ClickableAddress,
    vueSlider
  },
  data() {
    return {
      donationSliderOptions: {
        eventType: "auto",
        width: "auto",
        height: 4,
        dotSize: 10,
        dotHeight: null,
        dotWidth: null,
        min: 0,
        max: 100,
        interval: 1,
        show: true,
        speed: 0.5,
        disabled: false,
        piecewise: false,
        usdKeyboard: false,
        enableCross: true,
        tooltip: "always",
        tooltipDir: "top",
        reverse: false,
        clickable: true,
        realTime: false,
        lazy: false,
        formatter: null,
        bgStyle: {
          backgroundColor: "#414141",
          boxShadow: "inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)"
        },
        sliderStyle: {
          backgroundColor: "#414141"
        },
        tooltipStyle: { backgroundColor: "#414141", borderColor: "#414141" },
        processStyle: {
          backgroundColor: "#414141"
        },
        piecewiseActiveStyle: null,
        labelStyle: null,
        labelActiveStyle: null
      },
      formData: {
        errors: [],
        card: {},
        valueInETH: 0.5,
        valueInDAI: 60,
        recipient: 0,
        percentage: 5,
        benefactor: {
          address: "0xb189f76323678e094d4996d182a792e52369c005",
          name: "Electronic Frontier Foundation",
          website: "https://www.eff.org",
          image:
            "https://ipfs.infura.io/ipfs/QmY9ECy55kWevPJQ2RDYJxDmB16h5J8SfhEyuEUAUnAyGU",
          id: 1
        },
        message: null,
        currency: null
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
      "usdPrice",
      "ephemeralAddressFee",
      "ethBalance",
      "daiBalance",
      "daiAllowance"
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
    premuimCardInformation() {
      let cardInfoObject = {
        minInEth: 0,
        minInDai: 0,
        sendValueUSD: 0,
        sendValueOTHER: 0
      };
      if (this.card.cardMaxQnty > 0) {
        // the min price for the card in eth will be the card price in usd
        //deviled by the current usd/eth price as defined by the oracle

        cardInfoObject.minInEth = (
          this.card.cardMinPrice / this.usdPrice
        ).toFixed(2);
        cardInfoObject.minInDai = this.card.cardMinPrice;
      }

      return cardInfoObject;
    },
    equivalentFiatCost() {
      return Math.round(this.formData.valueInETH * this.usdPrice);
    }
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    validateDonationMethod() {
      if (
        this.formData.currency === undefined ||
        this.formData.currency === null
      ) {
        return false;
      }

      if (
        this.formData.currency === "ETH" &&
        this.formData.valueInETH > this.ethBalance
      ) {
        return false;
      }

      if (this.formData.currency === "ETH" && this.formData.valueInETH < 0.01) {
        return false;
      }

      if (
        this.formData.currency === "DAI" &&
        this.formData.valueInDAI > this.daiBalance
      ) {
        return false;
      }

      if (this.formData.currency === "DAI" && this.formData.valueInDAI < 1) {
        return false;
      }

      if (this.formData.percentage === undefined) {
        return false;
      }

      if (this.formData.benefactor === undefined) {
        return false;
      }

      return true;
    },
    validateSendingMethod() {
      if (this.formData.sendingMethod === undefined) {
        return false;
      }

      if (this.formData.sendingMethod === "ETH") {
        return Web3.utils.isAddress(this.formData.recipient);
      }

      return true;
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
      if (this.formData.currency === "ETH") {
        console.log("saving eth " + this.formData.currency + amount);
        this.formData.valueInETH = amount;
      } else {
        console.log("saving DAI " + this.formData.currency + amount);
        this.formData.valueInDAI = amount;
      }
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
      var recipient;
      var totalSendAmount;
      let claimableLink;
      let transactionValue;
      let currency;

      switch (this.formData.sendingMethod) {
        case "QR":
          recipient = null; //ephemeral address is generated in the store
          claimableLink = true;
          break;
        case "ETH":
          recipient = this.formData.recipient;
          claimableLink = false;
          break;
        case "Self":
          recipient = this.account;
          this.formData.recipient = recipient;
          claimableLink = false;
          break;
        default:
          this.formData.errors.push("Invalid send method selected");
      }
      switch (this.formData.currency) {
        case "ETH":
          currency = "ETH";
          totalSendAmount = this.formData.valueInETH;
          //the value in eth should be equal to the total selected for both gift and donation
          transactionValue = totalSendAmount;
          if (claimableLink) {
            //if the link is claimable we must add the ephemeral fee
            transactionValue += this.ephemeralAddressFee;
          }
          break;
        case "DAI":
          currency = "DAI";
          totalSendAmount = this.formData.valueInDAI;
          // in the case of dai we dont need to send any eth with (unless it is a claimable link)
          transactionValue = 0;
          if (claimableLink) {
            //if the link is claimable we must add the ephemeral fee
            transactionValue += this.ephemeralAddressFee;
          }
          break;
        default:
          this.formData.errors.push("Invalid currency type selected");
      }
      var donationAmount = (totalSendAmount * this.formData.percentage) / 100;
      var giftAmount =
        (totalSendAmount * (100 - this.formData.percentage)) / 100;

      // last thing to do is to cast the donation,gift and transaction values to strings
      // as they are converted to wei in the store and this requires string or bignumber inputs
      donationAmount = donationAmount.toString();
      giftAmount = giftAmount.toString();
      transactionValue = transactionValue.toString();

      if (this.formData.errors.length === 0) {
        let benefactorIndex = this.formData.benefactor.id;
        let cardIndex = this.formData.card.cardIndex;
        let message = this.formData.message;
        this.$store.dispatch(actions.MINT_CARD, {
          currency,
          recipient,
          benefactorIndex,
          cardIndex,
          message,
          donationAmount,
          giftAmount,
          claimableLink,
          transactionValue
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

.margin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.red-drop {
  background: rgba(0, 0, 0, 0);
  color: $darkgray;
  border: 0px solid $darkgray;
  height: 30px;
  text-align: right;
  direction: rtl;
}

.share-box {
  background: white;
  padding: 20px;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);

  .field {
    background: rgba(196, 196, 196, 0);
  }

  .subtext {
    line-height: normal;
    font-size: 14px;

    color: $darkgray;

    opacity: 0.9;
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
      background: rgba(196, 196, 196, 0) !important;
      border: 0;
    }

    div {
      color: $darkgray;
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

  color: $darkgray;
}

.input-label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  margin-top: 0.675rem;
  display: inline-block;
  color: $darkgray;
}
input,
textarea {
  margin-bottom: 1rem;
}
// textarea {
//   border: 1px solid $darkgray;

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
      margin-bottom: 20px;
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
  color: $darkgray;
}

.flex-column {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.small-address {
  font-size: 0.6rem;
}
</style>
