<template>
  <div class="container">
    <h1>RadiCards</h1>

    <div class="row">
      <div class="col">
        <span class="mt-5" v-if="totalSupply">There are currently <span class="badge badge-primary pl-2 pr-2 ml-2 mr-2">{{ totalSupply }}</span> cards in existence</span>
      </div>
      <div class="col">
        <router-link :to="{ name: 'create' }" class="btn btn-lg btn-outline-primary">
          Send
        </router-link>
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
