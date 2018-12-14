<template>
  <div class="container">
    <card :cdata="deepUrlCard"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Card from "../../components/widgets/Card";
import router from "../../router";
import * as actions from "../../store/actions";

export default {
  name: "creator",
  components: { Card },
  data() {
    return {
      dispatchCardCount: 0,
      dispatchCardDeep: 0
    };
  },
  computed: {
    ...mapState(["deepUrlCard"])
  },
  mounted() {
    console.log("loading Started");
    let currentPath = this.$route.path;
    let tokenId = currentPath.substring(
      currentPath.lastIndexOf(":") + 1,
      currentPath.length
    );
    this.$store.dispatch(actions.LOAD_DEEP_URL_CARD, { tokenId });
    console.log("mounted");
  },
  methods: {
    loadIntoStoreCard() {
      console.log("loading Started");
      let currentPath = this.$route.path;
      let tokenId = currentPath.substring(
        currentPath.lastIndexOf(":") + 1,
        currentPath.length
      );
      console.log(tokenId);
      this.$store.dispatch(actions.LOAD_DEEP_URL_CARD, { tokenId });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";
.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
}
</style>
