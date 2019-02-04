<template>
  <div class="container">
    <b-row v-if="getTransferStatus()!=='BADURL'">
      <b-col cols="12" md="6" style="display: flex; justify-content: center; padding-left: 2rem;">
        <card :cdata="deepUrlCard"/>
        <span class="cheeky-comment">
          <img src="/static/images/red-arrow.svg" class="dl-1">
          {{ $t("m.claimGiftClickCard")}}
        </span>
      </b-col>

      <b-col cols="12" md="6" style="padding-left: 30px;padding-right: 30px;">
        <h3 v-if="getTransferStatus()==='EMPTY'">{{ $t("m.claimGiftLoading")}}</h3>
        <br>
        <h3 v-if="getTransferStatus()==='TRIGGERED' && account!=null">{{ $t("m.claimGiftGetInfo")}}</h3>
        <p
          class="gift-desc pt-4 pb-4"
          v-if="getTransferStatus()==='TRIGGERED' && account!=null"
        >{{ $t("m.claimGiftGetInfo2")}}</p>
        <h3 class="gift-desc" v-if="getTransferStatus()==='READY'">{{ $t("m.claimGiftReady")}}</h3>
        <div class="input-label" v-if="deepUrlCard">
          <p class="pt-4 pb-4" v-if="deepUrlCard.giftAmount>0"></p>
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
          {{ $t("m.claimGiftTrans")}}
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
        <h3
          style="padding-top: 1rem;"
          v-if="getTransferStatus()==='TRANSFERRED'"
        >{{ $t("m.claimGiftTrans2")}}</h3>
        <h3 v-if="getTransferStatus()==='CLAIMED'">{{ $t("m.claimGiftAlreadyClaimed")}}</h3>
        <h3 v-if="account===null">{{ $t("m.claimGiftProviders")}}</h3>
        <p class="pt-4 pb-4" v-if="account===null">{{ $t("m.claimGiftProviders2")}}</p>

        <div v-if="account===null" class="container" style="text-align: left;">
          <b-row class="logoRow">
            <b-col cols="6" id="imToken">
              <a target="__blank" href="https://token.im/download">
                <span>
                  <img class="walletIcon" src="/static/icons/imToken_color.png">
                  <p>imToken Wallet</p>
                  <p class="walletDesc">Mobile wallet</p>
                </span>
              </a>
            </b-col>
            <b-col cols="6" id="trust">
              <a target="__blank" href="https://trustwallet.com/">
                <span>
                  <img class="walletIcon" src="/static/icons/trust.png">
                  <p>Trust Wallet</p>
                  <p class="walletDesc">Mobile wallet</p>
                </span>
              </a>
            </b-col>
          </b-row>
          <b-row class="logoRow">
            <b-col cols="6" id="status">
              <a target="__blank" href="https://status.im">
                <img class="walletIcon" src="/static/icons/status.png">
                <p>Status</p>
                <p class="walletDesc">Mobile wallet</p>
              </a>
            </b-col>
            <b-col cols="6" id="opera">
              <a target="__blank" href="https://www.opera.com/crypto">
                <img class="walletIcon" src="/static/icons/opera.png">
                <p>Opera</p>
                <p class="walletDesc">Android browser</p>
              </a>
            </b-col>
          </b-row>
          <b-row class="logoRow">
            <b-col cols="6" id="metamask">
              <a target="__blank" href="https://metamask.io">
                <img class="walletIcon" src="/static/icons/metamask.png">
                <p>MetaMask</p>
                <p class="walletDesc">Chrome addon</p>
              </a>
            </b-col>
            <b-col cols="6" id="portis">
              <div @click="initPortis">
                <span>
                  <img class="walletIcon" src="/static/icons/portis.png">
                  <p>Portis</p>
                  <p class="walletDesc">Web wallet</p>
                </span>
              </div>
            </b-col>
          </b-row>
        </div>

        <!-- <img src="/static/icons/gift.png" class="pt-5" alt style="width: 4rem;"> -->
      </b-col>
    </b-row>
    <h3
      v-if="getTransferStatus()==='BADURL'"
    >{{ $t("m.somethingWrong")}}</h3>
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
  width: 9rem;
  transform: rotate(6deg);
  font-weight: bold;
  padding-left: 5px;
  padding-right: 5px;

  @media (max-width: 1000px) {
    display: none;
  }
}

.input-label {
  font-size: 0.9rem;
  color: $darkred;
  text-align: left;
  width: 100%;
  padding-bottom: 0.15rem;
}

.h3 {
  margin-top: 20px;
}

.gift-desc {
  margin-top: 10px;
  font-size: 1rem;
  font-weight: 700;
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

.walletIcon {
  float: left;
  max-height: 40px;
  @media (max-width: 1000px) {
    padding-right: 100%;
  }
}

.walletDesc {
  font-size: 0.8rem;
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
