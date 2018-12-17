<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-md">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <h1>
            <span style="position: absolute; left: -9999px;">RadiCards</span>
            <img src="/static/images/logo.svg" alt="RadiCards">
          </h1>
        </router-link>

        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'cardshop' }" class="nav-link">Card Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'account' }" class="nav-link">
              Your cards
              <span class="ml-1 badge badge-primary" v-if="accountCards.length > 0">{{accountCards.length}}</span>
            </router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link :to="{ name: 'create' }" class="btn btn-lg btn-outline-primary">
              Send a card
            </router-link>
          </li>-->
        </ul>
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

    <footer class="footer container-fluid mt-5">
      <div class="row">
        <div class="col text-left">

          <router-link :to="{ name: 'about' }">About</router-link>

        </div>
        <div class="col text-right small">
          <current-network></current-network> 
          <clickable-address :eth-address="contractAddress"></clickable-address>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from "web3";
  import {mapGetters, mapState} from "vuex";
  import * as actions from "./store/actions";
  import * as mutations from "./store/mutation-types";
  import CurrentNetwork from "./components/widgets/CurrentNetwork";
  import ClickableAddress from "./components/widgets/ClickableAddress";

  export default {
    name: "app",
    components: {ClickableAddress, CurrentNetwork},
    data() {
      return {
        web3Detected: true
      };
    },
    computed: {
      ...mapState(["contractAddress", "accountCards", "account"])
    },
    async mounted() {

      if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        // Request account access if needed
        ethereum.enable()
          .then((value) => {
            console.log('Bootstrapping web app - provider acknowedgled', value);
            this.$store.dispatch(actions.INIT_APP, window.web3);
          })
          .catch((error) => {
            console.log('User denied access, boostrapping application using infura', error);
            window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/4ed01157025d44b0b0ad5932e1d877ea'));
            this.$store.dispatch(actions.INIT_APP, window.web3);
          });

      } else if (window.web3) {
        console.log('Running legacy web3 provider');
        window.web3 = new Web3(web3.currentProvider);
        this.$store.dispatch(actions.INIT_APP, window.web3);

      } else {
        console.log('Running without a web3 provider - falling back to infura');

        window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/4ed01157025d44b0b0ad5932e1d877ea'));
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        this.$store.dispatch(actions.INIT_APP, window.web3);
      }

    },
    created() {
      const loadData = function () {
        this.$store.dispatch(actions.LOAD_BENEFACTORS);
        this.$store.dispatch(actions.LOAD_CARDS);
      }.bind(this);

      this.$store.watch(() => this.$store.state.contractAddress, () => loadData());
      if (this.$store.state.contractAddress) {
        loadData();
      }

      const loadAccountData = function () {
        this.$store.dispatch(actions.LOAD_ACCOUNT_CARDS, {account: this.account});
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
  @import "styles/nav.scss";

  body {
    margin: 0;
    padding: 0;

    background-color: $white;
    background-image: url("/static/images/background.svg");
    background-repeat: no-repeat;
    background-attachment: static;
    background-position: top left;

    @include tabletAndUp() {
      background-position: top center;
    }

    color: $black;
    font-size: 100%; // 1rem = 16px
    font-family: "Helvetica", "Helvetica Neue", "Arial", sans-serif;
    letter-spacing: -0.03rem;
    line-height: 1.25rem;
  }

  // Selection */
  ::-moz-selection {
    background: $yellow;
    color: $black;
  }
  ::selection {
    background: $yellow;
    color: $black;
  }

  // Header
  header {
    max-width: $maxWidth;
    margin: 0 auto;
    padding: 1.25rem;
  }

  // Main
  main {
    max-width: $maxWidth;
    margin: 0 auto;
    padding: 1.25rem;
  }

  // Header
  footer {
    max-width: $maxWidth;
    margin: 0 auto;
    padding: 1.25rem;
    border-top: 1px solid rgba($black, 0.1);
  }

  // Input field
  .field {
    appearance: none;
    display: inline-block;
    min-width: 15rem;
    padding: 0.5rem;
    border-radius: 0 !important;
    border: 1px solid $greylight;
    background: rgba($white, 0.9);
    color: $black;

    font: inherit;

    &:hover {
      background: $white;
      border-color: $gray;
    }
}


// Badge
.badge.badge-primary {
  background: $black;
  color: $yellow;
  display: inline-block;
  padding: 0 0.25rem;
  min-width: 1.5em;
  height: 1.5em;
  border-radius: 0.75em !important;
  line-height: 1.5em;
}


.section {
  padding: 2rem 0;

  &:focus {
    outline: none;
    background: $white;
    border-color: $black;
  }

  &--textarea {
    resize: none;
  }

  &::-webkit-input-placeholder {
    color: rgba($gray, 0.5);
  }

  &:-moz-placeholder {
    color: rgba($gray, 0.5);
  }

  &::-moz-placeholder {
    color: rgba($gray, 0.5);
  }

  &:-ms-input-placeholder {
    color: rgba($gray, 0.5);
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
    border: 2px solid $black;
  }
}

.card-slider {
  display: flex;
  margin: 0 -1.25rem;
  padding: 2rem 1.25rem;
  overflow-x: auto;

  perspective: 1000px;
  scroll-snap-type: x mandatory;
  scroll-padding: 1.25rem;

  &::after {
    content: "";
    flex: 0 0 0.25rem;
  }

  & > * {
    scroll-snap-align: start;
  }
}

footer {
  color: $gray;

  a {
    color: $gray;
  }

  a:visited {
    color: $gray;
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
</style>
