<template>
  <section class="section section--charity">

    <h2>Charity</h2>
  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";

export default {
  name: "charity",
  computed: {},
  created() {}
};
</script>

<style lang="scss" scoped>
.section--charity {
  h1, h2 {
    margin-bottom: 2rem;
  }
  p, h3, h4, ul, ol {
    margin-bottom: 1rem;
  }
  ul {
    list-style: square;
    padding-left: 1rem;

    li {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
