<template>
  <div :class="['benefactor', {'isExpanded': expanded}]">
    <div class="benefactor__heading" @click="toggleDetail">
      <figure class="benefactor__img">
        <img :src="benefactor.image">
      </figure>

      <h6 class="benefactor__name mt-2">{{benefactor.name}}</h6>
      <div :class="['btn btn--narrow btn--reveal btn--subtle', {'btn--arrow-down': !expanded, 'btn--arrow-up': expanded}]">{{(expanded) ? 'Less info' : 'More info'}}</div>

      <input v-if="this.$route.path.lastIndexOf('create') !== -1" type="button" @click="selectBenefactor" class="btn btn--narrow" value="select">
    </div>

    <div class="benefactor__detail">
      <div class="benefactor__text">
        <!-- v-if="expanded" -->
        <p>{{charityDescription}}</p>
        <a
          v-if="this.$route.path.lastIndexOf('create') !== -1"
          target="__blank"
          :href="charityURL"
          class="a--external"
        >Learn more about charity</a>
      </div>
    </div>
  </div>
</template>

<script>
/* global web3:true */

import { mapState } from "vuex";
import router from "../../router";

export default {
  name: "benefactor",
  props: {
    benefactor: {
      type: Object
    }
  },
  computed: {
    charityDescription() {
      let allDescriptions = [
        "The Electronic Frontier Foundation (EFF) is a non-profit organisation defending free speech online, fight illegal surveillance and support freedom-enhancing technologies. Advocating for online civil liberty, EFF supports and promotes the adoption of open source software, encryption, security research and P2P tools.",
        "EnLAW is a non-profit organisation advocating for environmental rights in Thailand. Founded in 2001, it has set several legal precedents by carrying out successful strategic litigations against international corporates which contaminate local river, land and ocean with harmful waste and compound.",
        "The Open Money Initiative (OMI) is working to empower those living in economically repressed societies. We build cryptocurrency products and are currently investigating large-scale cryptocurrency airdrops for humanitarian aid. Public, open-source cryptocurrencies can be public commons for safeguarding people’s economic freedom, just as the internet is for communication and information freedom."
      ];
      return allDescriptions[this.benefactor.id - 1];
    },
    charityURL() {
      let allURLs = [
        "https://www.eff.org/",
        "https://enlawfoundation.org",
        "https://www.openmoneyinitiative.org/"
      ];
      return allURLs[this.benefactor.id - 1];
    }
  },
  methods: {
    selectBenefactor() {
      this.$emit("benefactorSelected");
    },
    toggleDetail() {
      this.expanded = !this.expanded;
    }
  },
  data() {
    return {
      status: "",
      expanded: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";

.benefactor {
  margin: 0 -2rem;
  transition: all 0.2s ease-in-out;

  @include tabletAndUp() {
    margin: 0;
  }

  &:hover,
  &.isExpanded {
    background: $white;
    box-shadow: 0 0.25rem 1rem rgba($black, 0.1);
  }

  &__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    cursor: pointer;
  }
  &__img {
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  &__name {
    margin-left: 1rem;
    margin-right: auto;
    font-weight: bold;
  }

  &__text {
    padding: 1rem;

    @include tabletAndUp() {
      padding: 1rem 1rem 1rem 6rem;
    }

    p + a {
      display: inline-block;
      margin-top: 0.5rem;
    }
  }

  &__detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.6s ease-in-out, opacity 0.6s ease-in-out;
    opacity: 0;
  }
  &.isExpanded .benefactor__detail {
    max-height: 70vh;
    opacity: 1;
  }

  & + .benefactor {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
