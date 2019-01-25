<template>
  <div class="container">lets claim a link!</div>
  
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
    let privateKey = this.$route.params.pk;
    console.log("privateKey", privateKey);
    this.$store.dispatch(actions.CLAIM_GIFT, { privateKey });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
}
.transferButton {
  background: #000000;
  font-family: Helvetica;
  line-height: normal;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  padding: 15px;
  border: 1px solid black;
}

.cheeky-comment {
  position: absolute;
  top: 60%;
  left: 82%;
  width: 9rem;
  transform: rotate(6deg);
  font-weight: bold;
}
.dl-1 {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
  width: 12%;
}
</style>
