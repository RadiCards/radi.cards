<template>
  <div class="container">
    <b-row v-if="getTransferStatus()!=='BADURL'">
      <b-col cols="12" md="6" style="display: flex; justify-content: center; padding-left: 2rem;">
        <div v-if="deepUrlCard">
        <card :cdata="deepUrlCard"/>
        <span class="cheeky-comment">
          <img src="/static/images/red-arrow.svg" class="dl-1">
          {{ $t("m.claimGiftClickCard")}}
        </span>
        </div>
          <div v-if="!deepUrlCard">
            <h3>{{ $t("m.claimGiftGetInfo2")}}</h3>
          </div>

      </b-col>

      <b-col cols="12" md="6" style="padding-left: 30px;padding-right: 30px;">
        <h3 v-if="getTransferStatus()==='EMPTY'">{{ $t("m.claimGiftLoading")}}</h3>
        <br>
        <h3
          class="gift-desc"
          v-if="getTransferStatus()==='TRIGGERED' && account!=null"
        >{{ $t("m.claimGiftGetInfo")}}</h3>
        <p
          class="gift-desc pt-4 pb-4"
          v-if="getTransferStatus()==='TRIGGERED' && account!=null"
        >Please wait</p>
        <h3 class="gift-desc" v-if="getTransferStatus()==='READY'">{{ $t("m.claimGiftReady")}}</h3>
        <div class="input-label" v-if="deepUrlCard">
          <p v-if="deepUrlCard.giftAmount>0"></p>
          <p
            v-if="deepUrlCard.daiDonation"
          >{{ $t("m.claimGiftTotal")}} {{deepUrlCard.giftAmount}} {{ $t("m.claimGiftTotalDAI")}}</p>
          <p
            v-if="!deepUrlCard.daiDonation"
          >{{ $t("m.claimGiftTotal")}} {{deepUrlCard.giftAmount}} {{ $t("m.claimGiftTotalETH")}}</p>
        </div>
        <input
          v-if="account"
          type="button"
          class="button button--fullwidth"
          @click="claimGift"
          v-bind:value="$t('m.claimGiftAction')"
          style="margin-top:10px"
        >

        <h3 style="padding-top: 1rem;" v-if="getTransferStatus()==='SUBMITTED'">
          <h3 class="input-label">{{ $t("m.claimGiftTrans")}}</h3>
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
        </h3>
        <h3 style="padding-top: 1rem;" v-if="getTransferStatus()==='TRANSFERRED'">
          <h3 class="input-label">{{ $t("m.claimGiftTrans2")}}</h3>
        </h3>
        <h3 class="input-label-notice" v-if="getTransferStatus()==='CLAIMED'">
          <img src="/static/icons/warning.svg" alt style="width: 0.9rem;">
          {{ $t("m.claimGiftAlreadyClaimed")}}
        </h3>
        <h3 class="gift-desc" v-if="account===null">{{ $t("m.claimGiftProviders")}}</h3>
        <p class="input-label pt-4 pb-4" v-if="account===null">{{ $t("m.claimGiftProviders2")}}</p>

        <div v-if="account===null" class="container" style="text-align: left;">
          <b-row class="logoRow">
            <b-col class="wallet-button" cols="6" id="imToken">
              <a target="__blank" v-b-toggle.collapse1 variant="primary">
                <span>
                  <img class="walletIcon" src="/static/icons/imToken_color.png">
                  <p>imToken</p>
                  <p class="walletDesc">{{ $t("m.mobileWallet")}}</p>
                </span>
              </a>
              <b-collapse id="collapse1" class="wallet-reg mt-2">
                <b-card>
                  <div class="walletDesc">{{ $t("m.newUser")}}</div>
                  <a target="__blank" href="https://token.im/download">{{ $t("m.install")}}</a>
                  <br>
                  <hr>
                  <div class="walletDesc">{{ $t("m.existingUser")}}</div>
                  <a target="__blank" :href="generateDeepURL()">{{ $t("m.logIn")}}</a>
                </b-card>
              </b-collapse>
            </b-col>
            <b-col class="wallet-button" cols="6" id="trust">
              <a target="__blank" @click="initPortis">
                <span>
                  <img class="walletIcon" src="/static/icons/portis.png">
                  <p>Portis</p>
                  <p class="walletDesc">{{ $t("m.webWallet")}}</p>
                </span>
              </a>
            </b-col>
          </b-row>
          <!-- <b-row class="logoRow">
            <b-col class="wallet-button" cols="6" id="status">
              <a target="__blank" href="https://status.im">
                <img class="walletIcon" src="/static/icons/status.png">
                <p>Status</p>
                <p class="walletDesc">{{ $t("m.mobileWallet")}}</p>
              </a>
            </b-col>
            <b-col class="wallet-button" cols="6" id="opera">
              <a target="__blank" href="https://www.opera.com/crypto">
                <img class="walletIcon" src="/static/icons/opera.png">
                <p>Opera</p>
                <p class="walletDesc">Android browser</p>
              </a>
            </b-col>
          </b-row>-->
          <b-row class="logoRow">
            <b-col class="wallet-button" cols="6" id="metamask">
              <a target="__blank" href="https://metamask.io">
                <img class="walletIcon" src="/static/icons/metamask.png">
                <p>MetaMask</p>
                <p class="walletDesc">{{ $t("m.chromeAddon")}}</p>
              </a>
            </b-col>
            <b-col class="wallet-button" cols="6" id="portis">
              <div @click="initPortis">
                <span>
                  <img class="walletIcon" src="/static/icons/portis.png">
                  <p>Portis</p>
                  <p class="walletDesc">{{ $t("m.webWallet")}}</p>
                </span>
              </div>
            </b-col>
          </b-row>
        </div>

        <!-- <img src="/static/icons/gift.png" class="pt-5" alt style="width: 4rem;"> -->
      </b-col>
    </b-row>
    <h3 v-if="getTransferStatus()==='BADURL'">{{ $t("m.somethingWrong")}}</h3>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Card from "../../components/widgets/Card";
import router from "../../router";
import * as actions from "../../store/actions";
import Portis from "@portis/web3";

export default {
  name: "creator",
  components: { Card },
  data() {
    return {
      dispatchCardCount: 0,
      dispatchCardDeep: 0
    };
  },
  computed: {
    ...mapState(["deepUrlCard", "account"]),
    ...mapGetters(["getTransferStatus"])
  },
  mounted() {
    let privateKey = this.$route.params.pk;
    console.log("privateKey", privateKey);
    this.$store.dispatch(actions.CLAIM_GIFT, { privateKey, execute: false });
  },
  methods: {
    generateDeepURL() {
      return (
        "imtokenv2://navigate/DappView?url=https://radi.cards" +
        this.$route.fullPath
      );
    },
    initPortis() {
      const portis = new Portis(
        "90dd46f3-6a56-4162-85dc-f310c53cced7",
        "mainnet"
      );
      const provider = portis.provider;
      window.web3 = new Web3(provider);
      this.$store.dispatch(actions.INIT_APP, window.web3);
    },
    claimGift() {
      let privateKey = this.$route.params.pk;
      this.$store.dispatch(actions.CLAIM_GIFT, {
        privateKey: privateKey,
        execute: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
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

.cheeky-comment {
  position: absolute;
  top: 60%;
  left: 82%;
  width: 5rem;
  transform: rotate(6deg);
  font-weight: bold;
  padding-left: 5px;
  padding-right: 5px;
  background-color: white;
  border-radius: 8px;

  @media (max-width: 1000px) {
    display: none;
  }
}

.input-label {
  font-size: 1rem;
  color: $darkgray;
  text-align: center;
  width: 100%;
  padding-bottom: 0.1rem;
  padding-top: 2rem;
  background-color: white;
}

.input-label-notice {
  font-size: 0.9rem;
  color: $darkred;
  text-align: center;
  width: 100%;
  padding-bottom: 1rem;
  margin-top: 0.5rem;
}

.h3 {
  margin-top: 20px;
}

.gift-desc {
  margin-top: 10px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.pb-4 {
  padding-bottom: 0rem;
}

.dl-1 {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}

.wallet-reg {
  box-shadow: 0 0.1rem 0.4rem rgba($gray, 0.3);
}

.wallet-button {
  padding-top: 0.8rem;
  padding-bottom: 0.6rem;
  padding-left: 0.7rem;
  padding-right: -0.5rem;
  transition: all 1s ease-in-out;

  &:visited {
    color: $white;
  }
  &:hover {
    -moz-transform: scale(1.03);
    -webkit-transform: scale(1.03);
    -o-transform: scale(1.03);
    -ms-transform: scale(1.03);
    -webkit-transform: scale(1.03);
    transform: scale(1.03);

    -webkit-transition: transform 1.05s ease-in-out;
    -moz-transition: transform 1.05s ease-in-out;
    -ms-transition: transform 1.05s ease-in-out;
  }
  &:focus {
    outline: none;
  }
}

.walletIcon {
  float: left;
  max-height: 40px;
  @media (max-width: 1000px) {
    padding-right: 100%;
  }
}

.walletDesc {
  font-size: 0.8rem;
  color: $gray;
}

.logoRow {
  padding-bottom: 1rem;
}

@media (min-width: 765px) {
  #imToken {
    display: none;
  }
  #trust {
    display: none;
  }
  #status {
    display: none;
  }
  #opera {
    display: none;
  }
}

@media (max-width: 765px) {
  #metamask {
    display: none;
  }
  #portis {
    display: none;
  }
}
</style>
