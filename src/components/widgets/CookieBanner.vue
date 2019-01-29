<template>
  <div v-if="showbanner" class="banner">
    <div class="container">
      <div class="message">
        <b>We use cookies to help us improve user experience</b>
        <span>
          Click
          <a href="https://www.iubenda.com/privacy-policy/69357887">here</a> to learn more about how do we collect and use your data
        </span>
      </div>

      <input type="button" class="accept-button" value="I allow cookies" @click="hide()">
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "cookiebanner",
  data() {
    return {
      showbanner: true
    };
  },
  methods: {
    hide() {
      this.showbanner = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.banner {
  background: #ffffff;
  border: 3px solid #000000;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 2;
  padding: 20px;

  .container {
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    max-width: 58rem;
  }

  .message {
    font-family: Helvetica;
    line-height: 20px;
    font-size: 15px;
    color: #000000;
    display: flex;
    flex-direction: column;

    b {
    }

    span {
    }
  }

  .accept-button {
    font-family: Helvetica;
    line-height: normal;
    font-size: 14px;
    text-align: center;
    background: black;
    color: white;
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
