<template>
  <div id="app">

    <header>
      <nav class="navbar navbar-expand-md">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          RadiCards
        </router-link>

        <ul class="navbar-nav mr-auto">
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'account' }" class="nav-link">
              My cards
              <span class="ml-2 badge badge-primary">{{accountCards.length}}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <div class="container-fluid mt-5" v-if="!web3Detected">
      <div class="row no-metamask text-center">
        <div class="col mt-2 mb-2">
          <img src="../static/metamask.png" style="max-height: 35px" class="mr-3"/> Please install the <code><a href="https://metamask.io/" target="_blank">METAMASK</a></code> extension to interact with the Ethereum blockchain
        </div>
      </div>
    </div>

    <main role="main" class="container-fluid">
      <router-view></router-view>
    </main>

    <footer class="footer container-fluid mt-5">
      <div class="row">
        <div class="col text-right small">
          <current-network></current-network>
          [<clickable-address :eth-address="contractAddress"></clickable-address>]
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3';
  import { mapGetters, mapState } from 'vuex';
  import * as actions from './store/actions';
  import * as mutations from './store/mutation-types';
  import CurrentNetwork from './components/widgets/CurrentNetwork';
  import ClickableAddress from './components/widgets/ClickableAddress';

  export default {
    name: 'app',
    components: {ClickableAddress, CurrentNetwork},
    data () {
      return {
        web3Detected: true
      };
    },
    computed: {
      ...mapState(['contractAddress', 'accountCards', 'account']),
    },
    async mounted () {

      let bootStrappedWeb3;

      // Modern dapp browsers...
      if (window.ethereum) {
        console.log(`Using post-Nov 2nd (approval) MetaMask`);
        bootStrappedWeb3 = new Web3(ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          console.log(`Enabled`);

          this.web3Detected = true;
        } catch (error) {
          // User denied account access...
          console.log(error);

          this.web3Detected = false;
        }
      } else if (window.web3) {
        console.log(`Using pre-Nov 2nd MetaMask`);
        bootStrappedWeb3 = new Web3(web3.currentProvider);

        this.web3Detected = true;
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

        this.web3Detected = false;
      }

      window.web3 = bootStrappedWeb3;

      // Bootstrap the full app
      this.$store.dispatch(actions.INIT_APP, bootStrappedWeb3);
    },
    created () {
      const loadData = function () {
        this.$store.dispatch(actions.LOAD_ACCOUNT_CARDS, {account: this.account});
      }.bind(this);

      this.$store.watch(
        () => this.$store.state.account,
        () => loadData()
      );

      if (this.$store.state.account) {
        loadData();
      }
    }
  };
</script>

<style lang="scss">

  $body-bg: #f5f5f5;
  $body-color: brown;
  $primary: darkgreen;
  $secondary: #fff0f2;
  $gray: #707070;
  $black: #040505;
  $white: #f5f5f5;

  $border-radius-base: 50;

  @import url('https://fonts.googleapis.com/css?family=Open+Sans');

  $font-family-base: 'Open Sans', sans-serif;

  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

  body {
      background-color: $body-bg;
  }

  #app {}

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

  .nav-link {
    color: $primary;

    a:visited {
      color: $primary;
    }

    a:hover {
      color: $primary;
    }
  }

  code {
    color: $primary;
  }

  main {
    min-height: 400px;
    margin-bottom: 50px;
    margin-top: 50px;
  }

  .no-metamask {
    background-color: $primary;

    a {
      color: $white;
    }
  }

</style>
