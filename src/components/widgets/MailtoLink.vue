<template>
  <a :href="hrefString" class target="_blank">
    <slot></slot>
  </a>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MailtoLink",
  props: {
    email: {
      type: String,
      required: true
    },
    subject: String,
    bodyText: String
  },
  data() {
    return {};
  },
  computed: {
    hrefString() {
      var str = "mailto:";
      str += this.email;
      if (this.subject) {
        str += "?subject=" + encodeURIComponent(this.subject);
      }
      if (this.bodyText) {
        str += this.subject ? "&" : "?";
        str += "body=" + encodeURIComponent(this.bodyText);
      }
      if (this.email.length < 1) {
        str = "javascript:alert('No email address given')";
      }
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
