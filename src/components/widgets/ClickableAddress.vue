<template>
  <a v-if="ethAddress" class="eth-address" :href="buildLink" target="_blank">{{ dotDotDot }}</a>
</template>

<script>
  /* global web3:true */
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'clickableAddress',
    components: {},
    props: {
      ethAddress: {
        type: String
      }
    },
    computed: {
      ...mapState([
        'etherscanBase',
      ]),
      dotDotDot: function () {
        if (this.ethAddress) {
          return this.ethAddress.substr(0, 6) + '...' + this.ethAddress.substr(this.ethAddress.length - 6, this.ethAddress.length);
        }
        return '';
      },
      buildLink: function () {
        return `${this.etherscanBase}/address/${this.ethAddress}`;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

// Eth Address
.eth-address {
  display: inline-block;
  padding: 0.125rem 0.25rem;
  background: rgba($black, 0.05);

  &:after {
    content: "↗";
    display: inline-block;
    padding-left: 0.25rem;
    font-size: 0.75rem;
    opacity: 0.25;
  }

  &:hover {
    background: rgba($black, 0.1);
    border-bottom: none;

    &:after {
      max-width: 2rem;
      opacity: 1;
    }
  }
}
</style>
