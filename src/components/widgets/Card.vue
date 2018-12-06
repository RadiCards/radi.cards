<template>

  <div class="card">
    <figure>
      <img src="" alt="" />
      <figcaption>
        <h4 class="title">Artwork name</h4>
        <p class="creator">Artist name</p>
        <p class="descr">Artwork description</p>
        <div class="value">0.5 ETH</div>
      </figcaption>
    </figure>
  </div>

</template>

<script>
  /* global web3:true */

  import {mapState} from 'vuex';

  export default {
    name: 'card',
    computed: {
      ...mapState(['card']),
    },
  }
</script>

<style lang="scss" scoped>
</style>
