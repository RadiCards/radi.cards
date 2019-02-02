<template>
  <div>
    <h1 class="smaller-heading">
      {{text}}
      <img src="/static/icons/wind.svg">
    </h1>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "windytitle",
  props: ["text"],
  // data() {
  //   return {
  //     text: ""
  //   };
  // },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

div {
  margin-bottom: 30px;
}

.smaller-heading {
  @media (max-width: 560px) {
    font-size: 2rem !important;
  }
}

img {
  transform: rotate(13.37deg);
  @media (max-width: 550px) {
    display: none;
  }
}



</style>
