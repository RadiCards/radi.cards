<template>
  <div class="card">
    <img v-if="(cdata.image && cdata.image.length > 0)" :src="cdata.image" :alt="cdata.name">
    <img v-else src="/static/icons/radi-cards.svg" alt>
    
    <input type="button" value="Select">
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "cardsmall",
  computed: {
    ...mapState(["card"]),
    isFlippable: function() {
      return this.message && this.message.length > 0;
    }
  },
  props: {
    cdata: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;

  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  img {
    width: 155px;
    height: 155px;
  }

  input {
    width: 90px;
    background: #000000;
    margin-top: 20px;
    margin-bottom: 20px;
    color: white;
    padding: 10px 20px;
    border: 0;
    font-family: Helvetica;
    line-height: normal;
    font-size: 14px;
    text-align: center;
  }
}
</style>
