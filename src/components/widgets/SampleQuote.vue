<template>
  <div class="card">
    <img src="/static/images/privacyforever.png">

    <div class="quote">Dear Vity,
      <br>Happy holiday!
      <br>Wish you were here with us &lt;3
      <br>
      <br>Love and hug
      <br>Mom
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "samplequote"
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

  img {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 153px;
    height: 153px;

    box-shadow: 0 0.25rem 1rem rgba($black, 0.1);

    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0 0.25rem 1.5rem rgba($black, 0.2);
      border-bottom: none;
    }
  }

  .quote {
    font-family: Helvetica;
    line-height: normal;
    font-size: 16px;
    text-align: center;
    font-style: italic;

    color: #000000;
  }
}
</style>
