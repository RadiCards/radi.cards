<template>
  <div>
    <h1>
      {{text}}
      <img src="/static/icons/Wind.png">
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

img {
  transform: rotate(13.37deg);
}
</style>
