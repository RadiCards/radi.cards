<template>
  <div class="benefactor-row">
    <img class="benefactor-img" :src="benefactor.image">
    <div class="benefactor-text">
      <span class="benefactor-name mt-2">{{benefactor.name}}</span>
      <div v-if="exapanded">
        <p
          class="mt-2"
        >The Electronic Frontier Foundation (EFF) is a non-profit organisation defending free speech online, fight illegal surveillance and support freedom-enhancing technologies. Advocating for online civil liberty, EFF supports and promotes the adoption of open source software, encryption, security research and P2P tools.</p>
        <input type="button" @click="selectBenefactor" class="m-3 selectButton" value="Select">
        
        <a href="https://www.w3schools.com">Learn More about charity</a>
      </div>
      <span class="benefactor-description">{{benefactor.description}}</span>
    </div>

    <div class="arrow-container">
      <a @click="expandDescription">
        <img class="arrow" src="/static/icons/Arrow.png">
      </a>
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
    }
  },
  methods: {
    selectBenefactor() {
      console.log("button clicked");
      this.$emit("benefactorSelected");
    },
    expandDescription() {
      this.exapanded = !this.exapanded;
    }
  },
  data() {
    return {
      status: "",
      exapanded: false
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

  .selectButton {
    background: #000000;
    font-family: Helvetica;
    line-height: normal;
    text-align: center;
    text-transform: lowercase;
    color: #ffffff;
    padding: 10px;
  }
}
</style>
