<template>
  <span v-if="ethAddress">
    <a class="token-id" :href="buildLink" target="_blank">{{ dotDotDot }}</a>
  </span>
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

<style>

</style>
