<template>
  <div class="container">
    <div v-if="account==null">
      <h4>{{ $t("m.noWeb3")}}</h4>
      <p class="pt-2">
        {{ $t("m.noWeb3desc")}}
        <a target="__blank" href="https://metamask.io">Meta Mask</a>,
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
          <div class="flex-column">
            <div class="step__info">
              <div class="step__title">
                <h4>{{ $t("m.customiseCard")}}</h4>
                <p>{{ $t("m.customiseCardDesc")}}</p>
              </div>
              <div class="input-label">
                <img src="/static/icons/warning.svg" alt style="width: 0.9rem;">
                {{ $t("m.addMessage")}}
              </div>
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
                :disabled="!formData.message"
                @click="goToStep(1)"
                value="NEXT"
              >
            </div>
          </div>
        </div>

        <!-- select where funds are going page -->
        <div class="section step step--twocol step2" v-if="step === 1">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="previewCardObject"></card>
          </div>
          <div class="flex-column">
            <div class="step__title">
              <h4>{{ $t("m.sendMethod")}}</h4>
              <p>{{ $t("m.chooseSendMethod")}}</p>
            </div>

            <div class="fieldgroup--radio column">
              <!-- QR -->
              <div :class="['field field--radio', {'isSelected': formData.sendingMethod === 'QR'}]">
                <input type="radio" id="selectQR" value="QR" v-model="formData.sendingMethod">
                <label for="selectQR" class="field--radio__content">
                  <p class="p--smallitalic">{{ $t("m.supported")}}</p>
                  <span v-if="formData.sendingMethod !== 'QR'" class="pretext">{{ $t("m.QR")}}</span>
                  <div v-if="formData.sendingMethod === 'QR'" class="sendOptionSelectedContent">
                    <p class="p--bold">{{ $t("m.QR")}}</p>
                  </div>
                </label>
              </div>

              <!-- ETH -->
              <div
                :class="['field field--radio', {'isSelected': formData.sendingMethod === 'ETH'}]"
              >
                <input type="radio" id="selectETH" value="ETH" v-model="formData.sendingMethod">
                <label for="selectETH" class="field--radio__content">
                  <p class="p--smallitalic">{{ $t("m.sendDirect")}}</p>
                  <span
                    v-if="formData.sendingMethod !== 'ETH'"
                    class="pretext"
                  >{{ $t("m.addEthWallet")}}</span>
                  <div v-if="formData.sendingMethod === 'ETH'" class="sendOptionSelectedContent">
                    <p class="p--bold">{{ $t("m.addEthWallet")}}</p>
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
                  <p class="p--smallitalic">{{ $t("m.sendLater")}}</p>
                  <span
                    v-if="formData.sendingMethod !== 'Self'"
                    class="pretext"
                  >{{ $t("m.sendOwn")}}</span>
                  <div v-if="formData.sendingMethod === 'Self'" class="sendOptionSelectedContent">
                    <p class="p--bold">{{ $t("m.sendOwn")}}</p>
                    <br>
                    <p>{{ $t("m.yourWallet")}}</p>
                    <p class="p--smallitalic small-account">{{account}}</p>
                  </div>
                </label>
              </div>
            </div>
            <br>
            <br>
            <input
              type="button"
              class="button button--fullwidth"
              :disabled="!validateSendingMethod()"
              @click="goToStep(2)"
              value="NEXT"
            >
            <p
              v-if="formData.sendingMethod==='QR'"
            >If you choose to generate a claimable link an extra 0.01ETH will be added as a fee.</p>
          </div>
        </div>

        <!-- add donation page -->
        <div class="section step step--twocol step2" v-if="step === 2">
          <div class="step__card">
            <card v-if="cards && this.card !== undefined" :cdata="previewCardObject"></card>
          </div>
          <div class="flex-column">
            <div class="step__title">
              <h4>{{ $t("m.topUp")}}</h4>
            </div>

            <div class="fieldgroup--radio column">
              <!-- Option 1 -->
              <div :class="['field field--radio', {'isSelected': formData.currency === 'ETH'}]">
                <input type="radio" id="selectETH" value="ETH" v-model="formData.currency">
                <label for="selectETH" class="field--radio__content">
                  <p class="p--smallitalic">{{ $t("m.topUpCrypto")}}</p>
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
                    <p
                      class="p--smallitalic"
                    >≈ {{equivalentFiatCost(formData.valueInETH)}}USD = {{equivalentCynCost(formData.valueInETH)}}RMB</p>
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
                  <p class="p--smallitalic">{{ $t("m.topUpStable")}}</p>
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

            <p class="margin">{{ $t("m.donateCharity")}}</p>
            <select class="margin charity-drop" v-model="formData.benefactor">
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
              @click="goToStep(3)"
              value="NEXT"
            >
            <p
              v-if="formData.currency === 'ETH' && formData.valueInETH > ethBalance"
            >{{ $t("m.noETH")}}{{parseFloat(ethBalance).toFixed(3)}}.</p>
            <p
              v-if="formData.currency === 'DAI' && formData.valueInDAI > daiBalance"
            >{{ $t("m.noDAI")}}{{parseFloat(daiBalance).toFixed(3)}}.</p>

            <p
              v-if="formData.currency === 'ETH' && formData.valueInETH * usdPrice < formData.card.cardMinPrice"
            >{{ $t("m.donateCharity")}}{{parseFloat(formData.card.cardMinPrice / usdPrice).toFixed(3)}} ETH.</p>
            <p
              v-if="formData.currency === 'DAI' && formData.valueInDAI < formData.card.cardMinPrice"
            >{{ $t("m.donateCharity")}}{{parseFloat(formData.card.cardMinPrice).toFixed(3)}} DAI.</p>
          </div>
        </div>

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
              <h4>{{ $t("m.ready")}}</h4>
              <p>{{ $t("m.readyDesc")}}</p>
              <br>
              <div class="field mt-2 mb-4">
                <div v-if="formData.currency==='ETH'">
                  <p>
                    <strong>Hongbao total value:</strong>
                    {{formData.valueInETH}}ETH ≈ {{equivalentFiatCost(formData.valueInETH)}}USD = {{equivalentCynCost(formData.valueInETH)}}RMB
                  </p>
                  <p class="p--smallitalic">
                    Charity: {{(formData.valueInETH*formData.percentage/100).toFixed(3)}}ETH ≈ {{equivalentFiatCost((formData.valueInETH*formData.percentage/100).toFixed(3))}}USD = {{equivalentCynCost((formData.valueInETH*formData.percentage/100).toFixed(3))}}RMB
                    <br>
                    Recipient: {{(formData.valueInETH*(100 - formData.percentage)/100).toFixed(3)}}ETH ≈ {{equivalentFiatCost((formData.valueInETH*(100 - formData.percentage)/100).toFixed(3))}}USD = {{equivalentCynCost((formData.valueInETH*(100 - formData.percentage)/100).toFixed(3))}}USD
                  </p>
                </div>

                <div v-if="formData.currency==='DAI'">
                  <p>
                    <strong>Hongbao total value:</strong>
                    {{formData.valueInDAI}}DAI
                  </p>
                  <p class="p--smallitalic">
                    Charity: {{(formData.valueInDAI*formData.percentage/100).toFixed(3)}}DAI
                    <br>
                    Recipient: {{(formData.valueInDAI*(100 - formData.percentage)/100).toFixed(3)}}DAI
                  </p>
                </div>

                <div v-if="formData.sendingMethod==='Self'">
                  <p>
                    <strong>Recipient:</strong> my ETH wallet
                  </p>
                  <p class="p--smallitalic">{{formData.recipient}}</p>
                </div>
                <div v-if="formData.sendingMethod==='ETH'">
                  <p>
                    <strong>Recipient:</strong> other ETH address
                  </p>
                  <p class="p--smallitalic">{{formData.recipient}}</p>
                </div>
                <div v-if="formData.sendingMethod==='QR'">
                  <p>
                    <strong>Recipient:</strong> email, WeChat or other chat apps
                  </p>
                  <p class="p--smallitalic">QR code will be generated in next step.</p>
                </div>

                <strong>Card Message:</strong>
                <br>
                <p class="p--smallitalic">{{formData.message}}</p>
              </div>
              <br>
              <input
                type="button"
                class="button button--fullwidth"
                @click="giveBirth"
                value="CREATE HANGBAO"
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

            <h4>{{ $t("m.transactionTriggered")}}</h4>
            <br>
            <p>{{ $t("m.transactionTriggeredDesc")}}</p>

            <p
              v-if="formData.currency=='DAI' && daiAllowance < formData.valueInDai"
            >{{ $t("m.DAIDisclaimer")}}</p>
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

            <h4>{{ $t("m.cardCreated")}}</h4>
            <p>{{ $t("m.cardCreatedDesc")}}</p>
            <br>
            <p>{{ $t("m.cardCreatedDesc2")}}</p>
            <p>{{ $t("m.cardCreatedDesc3")}}</p>
            <br>
            <p v-if="getGiftingStatus(account, formData.card.cardIndex).tx">
              {{ $t("m.cardCreatedDesc4")}}
              <a
                class="a--external"
                :href="etherscanBase + '/tx/' + getGiftingStatus(account, formData.card.cardIndex).tx"
                target="_blank"
              >{{ $t("m.cardCreatedDesc5")}}</a>
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

            <h4>{{$t("m.rock")}}</h4>

            <p v-if="formData.sendingMethod != 'QR'">
              {{$t("m.sendSuccess")}}
              <clickable-address :eth-address="formData.recipient"></clickable-address>
            </p>
            <p v-if="formData.sendingMethod=='QR'">
              {{$t("m.claimableLink")}}
              <br>
              <qr-code-image :link="'https://radi.cards/claim/' + ephemeralPrivateKey"></qr-code-image>
              https://radi.cards/claim/{{ephemeralPrivateKey}}
              <a
                @click="copyToClipboard('https://radi.cards/claim/' + ephemeralPrivateKey)"
                target="_blank"
                class="btn btn--narrow btn--subtle"
                style="margin-top: 0.5rem;"
              >Copy</a>
            </p>
            <br>

            <!-- <div class="share-box">
              <h2>{{$t("m.shareOthers")}}</h2>
              <br>
              <span class="subtext">{{$t("m.shareOthersEmail")}}</span>
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
              <span class="subtext">{{$t("m.shareOthersLink")}}</span>
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
                  @click="copyToClipboard('https://radi.cards/card/' + getGiftingStatus(account, formData.card.cardIndex).tokenId)"
                  target="_blank"
                >copy</div>
              </div>
            </div>-->
            <div>
              <button
                @click="startOverCreation"
                style="width:100%; margin-top:20px;"
                class="btn pick"
              >{{$t("m.pickAnother")}}</button>
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
            <h4>{{$t("m.oops")}}</h4>

            <p>{{$t("m.oopsDesc")}}</p>
            <br>
            <p class="pb-3">
              <strong>{{$t("m.checkWallet")}}</strong>
              {{$t("m.checkWalletDesc")}}
            </p>

            <button @click="startOverCreation" class="btn">{{$t("m.startOver")}}</button>
            <button class="btn" @click="giveBirth">{{$t("m.retry")}}</button>
            <p v-if="getGiftingStatus(account, formData.card.cardIndex).tx">
              {{$t("m.viewEthScan")}}
              <a
                class="a--external"
                :href="etherscanBase + '/tx/' + getGiftingStatus(account, formData.card.cardIndex).tx"
                target="_blank"
              >{{$t("m.cardCreatedDesc5")}}</a>
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
import QrCodeImage from "../../components/widgets/QRCodeImage";
import { AssertionError } from "assert";
import vueSlider from "vue-slider-component";

export default {
  name: "creator",
  components: {
    ClickableTransaction,
    QrCodeImage,
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
        valueInETH: 0.02,
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
      "daiAllowance",
      "ephemeralPrivateKey",
      "cynPrice"
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
    }
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    equivalentFiatCost(ethAmount) {
      return parseFloat(ethAmount * this.usdPrice).toFixed(2);
    },
    equivalentCynCost(ethAmount) {
      return (parseFloat(ethAmount * this.usdPrice) / this.cynPrice).toFixed(2);
    },
    startOverCreation: function(event) {
      event.preventDefault();
      this.$store.dispatch(actions.RESET_GIFT_STATUS);
      this.$router.push({ name: "cardshop" });
    },
    validateDonationMethod() {
      // valid input
      if (
        this.formData.currency === undefined ||
        this.formData.currency === null
      ) {
        return false;
      }

      if (this.formData.percentage === undefined) {
        return false;
      }

      if (this.formData.benefactor === undefined) {
        return false;
      }

      // user has enough balance to send card
      if (
        this.formData.currency === "ETH" &&
        this.formData.valueInETH > this.ethBalance
      ) {
        return false;
      }

      if (
        this.formData.currency === "DAI" &&
        this.formData.valueInDAI > this.daiBalance
      ) {
        return false;
      }

      // user enough has been selected for the price of the card
      if (
        this.formData.currency === "ETH" &&
        this.formData.valueInETH * this.usdPrice <
          this.formData.card.cardMinPrice
      ) {
        return false;
      }

      if (
        this.formData.currency === "DAI" &&
        this.formData.valueInDAI < this.formData.card.cardMinPrice
      ) {
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
          transactionValue = parseFloat(totalSendAmount);
          if (claimableLink) {
            //if the link is claimable we must add the ephemeral fee
            console.log(transactionValue);
            transactionValue += parseFloat(this.ephemeralAddressFee);
          }
          break;
        case "DAI":
          currency = "DAI";
          totalSendAmount = this.formData.valueInDAI;
          // in the case of dai we dont need to send any eth with (unless it is a claimable link)
          transactionValue = 0;
          if (claimableLink) {
            //if the link is claimable we must add the ephemeral fee
            transactionValue += parseFloat(this.ephemeralAddressFee);
          }
          break;
        default:
          this.formData.errors.push("Invalid currency type selected");
      }
      var donationAmount = (
        (totalSendAmount * this.formData.percentage) /
        100
      ).toFixed(10);
      var giftAmount = totalSendAmount - donationAmount;

      // last thing to do is to cast the donation,gift and transaction values to strings
      // as they are converted to wei in the store and this requires string or bignumber inputs
      donationAmount = donationAmount.toString();
      giftAmount = giftAmount.toFixed(10).toString();
      transactionValue = transactionValue.toFixed(10).toString();
      console.log(transactionValue);

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
      // if (this.formData.valueInETH < 0.02) {
      //   this.formData.errors.push("Value must be at least 0.02ETH");
      // }
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

.charity-drop {
  color: $darkgray;
  border: 0px solid $darkgray;
  height: 30px;
  width: 100%;
}

.share-box {
  background: white;
  padding: 20px;
}
.field {
  background: white;
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

  .copy-field {
    display: flex;
    flex-direction: row;

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
  font-size: 0.79rem;
  color: $darkred;
  text-align: left;
  width: 100%;
  padding-bottom: 0.15rem;
}
input,
textarea {
  margin-bottom: 1rem;
  width: 100%;
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
    // color: white;
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
