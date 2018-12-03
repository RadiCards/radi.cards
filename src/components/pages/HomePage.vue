<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-5">
        <h1 class="display-4 text-left mb-4 text-primary">RadiCards</h1>
        <h2>Blah blah blah</h2>
        <p class="mt-5" v-if="totalSupply">There are currently <span class="badge badge-primary pl-2 pr-2 ml-2 mr-2">{{ totalSupply }}</span> cards in existence</p>
      </div>
    </div>
  </div>

</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';

  export default {
    name: 'home',
    components: {

    },
    data () {
      return {};
    },
    computed: {
      ...mapState(['totalSupply'])
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>

  body > .container {
    padding: 60px 60px 0;
  }

  h1 {}

  .card {}

  /* mobile only */
  @media screen and (max-width: 767px) {
  }

</style>
