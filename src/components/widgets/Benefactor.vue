<template>
  <div class="benefactor-row">
    <img class="benefactor-img">

    <div class="benefactor-text">
      <span class="benefactor-name">{{benefactor.name}}</span>
      <span class="benefactor-description">{{benefactor.description}}</span>
    </div>

    <a href="{benefactor.website}">
      <img class="arrow">
    </a>
  </div>
</template>

<script>
/* global web3:true */

import { mapState } from "vuex";

export default {
  name: "card",

  computed: {},
  props: {
    benefactor: {
      type: Object
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";

.benefactor-row {
  display: flex;

  .benefactor-img {
    width: 60px;
    height: 60px;
    margin: 20px;
  }

  .arrow {
    width: 10px;
    height: 20px;
    margin: 0 auto;
    border-bottom: 1px solid #c4c4c4;
  }

  .benefactor-text {
    border-bottom: 1px solid #c4c4c4;
  }
}
</style>
