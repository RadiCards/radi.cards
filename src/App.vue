<template>
  <div id="app">
    <hr class="m-0 p-0">
    <header>
      <p class="notice" v-if="!account && currentNetwork && !isWeChatBrowser()">
        {{ $t("m.pleaseUnlock")}}
        <a
          href="https://metamask.io/"
          target="_blank"
          style="color: #ff9284"
        >MetaMask</a>
        {{ $t("m.orSignIn")}} <a @click="initPortis"> Portis</a>.
      </p>
      <p
        class="notice"
        v-if="currentNetwork!=='Main Ethereum Network' && !isWeChatBrowser() && currentNetwork"
      >{{ $t("m.currentlyConnected")}} {{currentNetwork}}{{ $t("m.SwitchToMainnet")}}</p>

      <p
        class="notice"
        v-if="isWeChatBrowser()"
      >{{ $t("m.openNormalBrowser")}}</p>

      <nav class="navbar navbar-expand-md">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <h1>
            <img src="/static/images/logo_cn.svg" alt="RadiCards">
          </h1>
        </router-link>

        <ul class="navbar-nav">
          <li class="nav-item">
            <a href="https://github.com/RadiCards/radi.cards" target="_blank">
              <img
                border="0"
                alt="Radi's Github"
                src="static/icons/github-brands.svg"
                width="25"
                height="25"
              >
            </a>
          </li>
          <li class="nav-item">
            <a href="https://t.me/RadiCards" target="_blank">
              <img
                border="0"
                alt="Radi's Telegram"
                src="/static/images/telegram.svg"
                width="25"
                height="25"
              >
            </a>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about' }" class="nav-link">{{ $t("m.about")}}</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'charity' }" class="nav-link">{{ $t("m.charity")}}</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'cardshop' }" class="nav-link">{{ $t("m.cardShop")}}</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'account' }" class="nav-link">
              {{ $t("m.myCards")}}
              <span
                class="ml-1 badge badge-primary"
                v-if="accountCards.length > 0"
              >{{accountCards.length}}</span>
            </router-link>
          </li>
          <li class="nav-item" v-if="ephemeralWallets.length > 0">
            <router-link :to="{ name: 'sent' }" class="nav-link">
              Sent Cards
              <span
                class="ml-1 badge badge-primary"
                v-if="ephemeralWallets.length > 0"
              >{{ephemeralWallets.length}}</span>
            </router-link>
          </li>
          <hr class="show-mobile">
          <li class="nav-item">
            <div class="col-lg-12 text-right">
              <button
                @click="changeLanguage('english')"
                :class="['button button--tiny', {'isSelected' : language==='english'}]"
              >EN</button>

              <button
                @click="changeLanguage('chinese')"
                :class="['button button--tiny', {'isSelected' : language==='chinese'}]"
              >中文</button>
            </div>
          </li>
          <!-- <li class="nav-item">
            <router-link :to="{ name: 'create' }" class="btn btn-lg btn-outline-primary">
              Send a card
            </router-link>
          </li>-->
        </ul>

        <div class="navbar-hamburger" @click="togglePopover()">
          <img src="/static/icons/hamburger_thin.svg">
        </div>

        <div class="navbar-popover" v-if="showNavPopover">
          <ul>
            <li class="nav-item nav-close" @click="togglePopover()">
              <img src="/static/icons/cross_thin.svg">
            </li>
            <li class="nav-item">
              <a href="https://t.me/RadiCards">
                <img
                  border="0"
                  alt="Radi's Telegram"
                  src="/static/images/telegram.svg"
                  width="25"
                  height="25"
                >
              </a>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'about' }" class="nav-link">{{ $t("m.about")}}</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'charity' }" class="nav-link">{{ $t("m.charity")}}</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'cardshop' }" class="nav-link">{{ $t("m.cardShop")}}</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'account' }" class="nav-link">
                {{ $t("m.myCards")}}
                <span
                  class="ml-1 badge badge-primary"
                  v-if="accountCards.length > 0"
                >{{accountCards.length}}</span>
              </router-link>
            </li>
            <hr class="show-mobile">
            <li class="nav-item" v-if="ephemeralWallets.length > 0">
              <router-link :to="{ name: 'sent' }" class="nav-link">
                Sent Cards
                <span
                  class="ml-1 badge badge-primary"
                  v-if="ephemeralWallets.length > 0"
                >{{ephemeralWallets.length}}</span>
              </router-link>
            </li>

            <li class="nav-item">
              <div class="col-lg-12 text-right">
                <button
                  @click="changeLanguage('english')"
                  :class="['button button--tiny', {'isSelected' : language==='english'}]"
                >EN</button>
                <button
                  @click="changeLanguage('chinese')"
                  :class="['button button--tiny', {'isSelected' : language==='chinese'}]"
                >中文</button>
              </div>
            </li>
            <!-- <li class="nav-item">
              <router-link :to="{ name: 'create' }" class="btn btn-lg btn-outline-primary">
                Send a card
              </router-link>
            </li>-->
          </ul>
        </div>
      </nav>
    </header>
    <div class="container-fluid mt-5" v-if="!web3Detected">
      <div class="row no-metamask text-center">
        <div class="col mt-2 mb-2">
          <img src="../static/metamask.png" style="max-height: 35px" class="mr-3"> Please install the
          <code>
            <a href="https://metamask.io/" target="_blank">METAMASK</a>
          </code> extension to interact with the Ethereum blockchain
        </div>
      </div>
    </div>

    <main role="main">
      <router-view></router-view>
    </main>
    <div class="topBar">
      <div>
        <div class="row">
          <div class="col-lg-8">
            <div v-if="account">
              <strong>
                <!-- <img border="0" alt="wallet" src="/static/icons/wallet.svg" width="20" height="20"> -->
                {{ $t("m.myAddress")}}
              </strong>
              <clickable-address :eth-address="account"></clickable-address>|
              <strong>{{ $t("m.myBalanceEth")}}</strong>
              {{ethBalanceRound}} |
              <strong>{{ $t("m.myBalanceDai")}}</strong>
              {{daiBalanceRound}}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!account"></div>
    </div>
    <footer class="footer container-fluid mt-5">
      <div class="row">
        <div class="col text-left">
          <router-link :to="{ name: 'terms-of-service' }">{{ $t("m.terms")}}</router-link>&nbsp;&nbsp;
          <!-- <router-link :to="{ name: 'privacy-policy' }">Privacy Policy</router-link> -->
        </div>
        <div class="col text-right small">
          <current-network></current-network>&nbsp;
          <clickable-address :eth-address="contractAddress"></clickable-address>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
/* global web3:true */

import Web3 from "web3";
import { mapGetters, mapState } from "vuex";
import * as actions from "./store/actions";
import * as mutations from "./store/mutation-types";
import CurrentNetwork from "./components/widgets/CurrentNetwork";
import ClickableAddress from "./components/widgets/ClickableAddress";
import Portis from "@portis/web3";

export default {
  name: "app",
  components: { ClickableAddress, CurrentNetwork },
  data() {
    return {
      web3Detected: true,
      language: "english",
      showNavPopover: false
    };
  },
  methods: {
    isWeChatBrowser() {
      return navigator.userAgent.match(/MicroMessenger/) != null;
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
    changeLanguage(newLanguage) {
      this.language = newLanguage;
      if (newLanguage === "english") {
        this.$i18n.locale = "en";
      }
      if (newLanguage === "chinese") {
        this.$i18n.locale = "zh";
      }
    },
    togglePopover() {
      this.showNavPopover = !this.showNavPopover;
    }
  },
  computed: {
    ...mapState([
      "contractAddress",
      "accountCards",
      "account",
      "usdPrice",
      "ethBalance",
      "daiBalance",
      "currentNetwork",
      "ephemeralWallets"
    ]),
    ethBalanceRound() {
      if (this.ethBalance) {
        return parseFloat(this.ethBalance).toFixed(3);
      }
      return 0;
    },
    daiBalanceRound() {
      if (this.daiBalance) {
        return parseFloat(this.daiBalance).toFixed(3);
      }
      return 0;
    }
  },
  async mounted() {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);

      // Request account access if needed
      ethereum
        .enable()
        .then(value => {
          console.log("Bootstrapping web app - provider acknowedgled", value);
          this.$store.dispatch(actions.INIT_APP, window.web3);
        })
        .catch(error => {
          console.log(
            "User denied access, boostrapping application using infura",
            error
          );
          window.web3 = new Web3(
            new Web3.providers.HttpProvider(
              "https://mainnet.infura.io/v3/4ed01157025d44b0b0ad5932e1d877ea"
            )
          );
          this.$store.dispatch(actions.INIT_APP, window.web3);
        });
    } else if (window.web3) {
      console.log("Running legacy web3 provider");
      window.web3 = new Web3(web3.currentProvider);
      this.$store.dispatch(actions.INIT_APP, window.web3);
    } else {
      // console.log("Bootstrapping web app - provider acknowedgled");
      // const portis = new Portis(
      //   "90dd46f3-6a56-4162-85dc-f310c53cced7",
      //   "mainnet"
      // );
      // const provider = portis.provider;
      // window.web3 = new Web3(provider);
      window.web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://mainnet.infura.io/v3/4ed01157025d44b0b0ad5932e1d877ea"
        )
      );
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      this.$store.dispatch(actions.INIT_APP, window.web3);
    }
    ``;
  },
  created() {
    let queryLanguage = this.$route.query.locale;

    try {
      let queryLanguage = this.$route.query.locale;
      console.log(queryLanguage);
      if (
        queryLanguage === "zh-CN" ||
        queryLanguage === "zh-Hant-US" ||
        queryLanguage === "zh-Hant-HK" ||
        queryLanguage === "zh-Hant-TW"
      ) {
        this.changeLanguage("chinese");
      }

      // imToken.callAPI("device.getCurrentLanguage", function(
      //   err,
      //   languageReturned
      // ) {
      //   console.log(err);
      //   if (languageReturned === "zh-CN") {
      //     this.changeLanguage("chinese");
      //   }
      // });
    } catch (e) {
      if (navigator.language === "zh-CN") {
        this.changeLanguage("chinese");
      }
    }
    const loadData = function() {
      this.$store.dispatch(actions.LOAD_BENEFACTORS);
      this.$store.dispatch(actions.LOAD_CARDS);
      this.$store.dispatch(actions.GET_USD_PRICE);
    }.bind(this);

    this.$store.watch(
      () => this.$store.state.contractAddress,
      () => loadData()
    );
    if (this.$store.state.contractAddress) {
      loadData();
    }

    const loadAccountData = function() {
      this.$store.dispatch(actions.LOAD_ACCOUNT_CARDS, {
        account: this.account
      });
    }.bind(this);

    this.$store.watch(() => this.$store.state.account, () => loadAccountData());
    if (this.$store.state.account) {
      loadAccountData();
    }
  }
};
</script>

<style lang="scss">
// SCSS includes
@import "styles/variables.scss";
@import "styles/mixins.scss";

// Base
@import "styles/reset.scss";
@import "styles/typography.scss";

// Elements
@import "styles/button.scss";
@import "styles/field.scss";
@import "styles/nav.scss";

body {
  margin: 0;
  padding: 0;

  background-color: #ffffff;
  background-image: url("/static/images/pattern.svg");
  background-repeat: repeat;
  background-attachment: static;
  background-position: top left;

  @include tabletAndUp() {
    background-position: top center;
  }

  color: $darkgray;
  font-size: 100%; // 1rem = 16px
  font-family: "Helvetica", "Helvetica Neue", "Arial", sans-serif;
  letter-spacing: -0.03rem;
  line-height: 1.25rem;
}
// Notification */

.notice {
  color: $darkred;
  background: white;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0.1rem 1rem rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 35%;
  margin: auto;

  @include tabletAndDown() {
    width: 90%;
  }

  @media (max-width: 630px) {
    color: #d35443;
    font-size: 12px;
    line-height: 14px;
  }
}

// Selection */
::-moz-selection {
  background: $yellow;
  color: $darkgray;
}
::selection {
  background: $yellow;
  color: $darkgray;
}

// Header
header {
  max-width: $maxWidth;
  margin: 0 auto;
  padding: 1.25rem;

  @include tabletAndDown() {
    max-width: 100%;
  }
}

// Main
main {
  max-width: $maxWidth;
  margin: 0 auto;
  padding: 0.25rem;

  @include tabletAndUp() {
    padding: 1.25rem;
  }
}

// Header
footer {
  max-width: $maxWidth;
  margin: 0 auto;
  padding: 1.25rem;
  border-top: 1px solid rgba($darkgray, 0.1);
}

// Badge
.badge {
  display: inline-block;
  padding: 0 0.5rem;
  min-width: 1.5em;
  height: 1.5em;
  border-radius: 0.75em !important;
  line-height: 1.5em;

  &-primary {
    background: $darkgray;
    color: $yellow;
    padding: 0 0.25rem;
  }
  &-yellow {
    background: $yellow;
    color: $darkgray;
  }
  &-huge {
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 2.5rem;
  }
  &-large {
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 2rem;
  }
}

.topBar {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 5px;
  margin-bottom: 0;
}

.section {
  padding: 2rem 0;

  &:focus {
    outline: none;
    background: $white;
    border-color: $darkgray;
  }

  &--textarea {
    resize: none;
  }

  &::-webkit-input-placeholder {
    color: rgba($darkgray, 0.5);
  }

  &:-moz-placeholder {
    color: rgba($darkgray, 0.5);
  }

  &::-moz-placeholder {
    color: rgba($darkgray, 0.5);
  }

  &:-ms-input-placeholder {
    color: rgba($darkgray, 0.5);
  }
}

.section {
  padding: 2rem 0;

  &__title {
    display: inline-block;
    margin-bottom: 0.5rem;
    padding: 0.125rem 0.75rem;
    font-size: 0.75rem;
    font-weight: bold;
    border: 2px solid $darkgray;
  }
}

.show-mobile {
  @media (min-width: 766px) {
    display: none;
  }
}

.card-slider {
  display: flex;
  margin: 0 -1.25rem;
  padding: 2rem 1.25rem;
  overflow-x: auto;
  @media (max-width: 560px) {
    padding-top: 0;
  }

  perspective: 1000px;

  &::after {
    content: "";
    flex: 0 0 0.25rem;
  }

  // Temporarily disabled this cool feature because some :( browsers don't seem to roll well with it

  // @supports (scroll-snap-type: x mandatory) {
  //   scroll-snap-type: x mandatory;
  //   scroll-padding: 1.25rem;

  //   & > * {
  //     scroll-snap-align: start;
  //   }
  // }
}

footer {
  color: $darkgray;

  a {
    color: $darkgray;
  }

  a:visited {
    color: $darkgray;
  }

  a:hover {
    color: $gray;
  }

  margin-bottom: 30px;
}

code {
  color: $primary;
}

.no-metamask {
  background-color: $primary;

  a {
    color: $white;
  }
}

.loading-container {
  width: 100%;
  padding: 2rem 0;
  text-align: center;

  .loading-spinner {
    margin: 0 auto;
  }
}
.loading-spinner {
  @include loadingSpinner();
}
</style>
