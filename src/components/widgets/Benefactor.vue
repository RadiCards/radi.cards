<template>
  <div class="benefactor-row">
    <img class="benefactor-img">

    <div class="benefactor-text">
      <span class="benefactor-name">{{benefactor.name}}</span>
      <span class="benefactor-description">No Description in the Contract!</span>
    </div>

    <div class="arrow-container">
      <a :href="benefactor.website">
        <img class="arrow" src="/static/icons/Arrow.png">
      </a>
    </div>

    <div class v-if="mode=='send'">
      <b-form-checkbox
        id="checkbox1"
        v-model="status"
        value="accepted"
        unchecked-value="not_accepted"
      >Select This Charity</b-form-checkbox>
    </div>
  </div>
</template>

<script>
/* global web3:true */

import { mapState } from "vuex";

export default {
  name: "benefactor",
  computed: {},
  props: {
    benefactor: {
      type: Object
    },
    mode: {
      type: String
    }
  },
  data() {
    return {
      status: ""
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";

.benefactor-row {
  display: flex;
  // justify-content: center;

  .benefactor-img {
    width: 60px;
    height: 60px;
    margin: 20px;
  }

  .arrow {
    width: 10px;
    height: 20px;
  }

  .benefactor-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #c4c4c4;
    flex-grow: 1;
  }

  .arrow-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #c4c4c4;
    margin-right: 20px;
  }
}
</style>
