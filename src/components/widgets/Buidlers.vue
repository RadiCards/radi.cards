<template>
  <div class="container">
    <div v-for="(item, index) in buidlersArray" :key="index">
      <a :href="item.url" target="_blank">
        <img :src="item.image" :alt="item.name">
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "buidlers",
  data() {
    return {
      buidlersArray: [
        {
          name: "KnownOrigin",
          url: "https://knownorigin.io/",
          image: "/static/60px.jpg"
        },
        {
          name: "KnownOrigin",
          url: "https://knownorigin.io/",
          image: "/static/60px.jpg"
        },
        {
          name: "KnownOrigin",
          url: "https://knownorigin.io/",
          image: "/static/60px.jpg"
        },
        {
          name: "D1Labs",
          url: "https://d1labs.com/",
          image: "/static/60px.jpg"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";

.container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 30px;

  img {
    width: 60px;
    height: 60px;
  }
}
</style>
