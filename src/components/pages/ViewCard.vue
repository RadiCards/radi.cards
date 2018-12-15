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
    let tokenId = this.$route.params.id;
    this.$store.dispatch(actions.LOAD_DEEP_URL_CARD, { tokenId });
  },
  methods: {}
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
