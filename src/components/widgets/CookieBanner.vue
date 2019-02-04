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
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 2;
  padding: 20px;
  box-shadow: 0 0.5rem 0.5rem rgba($gray, 0.3);

  @media (max-width: 630px) {
    padding: 10px;
  }

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

    @media (max-width: 630px) {
      line-height: 10px;
      font-size: 10px;
    }

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

    @media (max-width: 630px) {
      font-size: 10px;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>
