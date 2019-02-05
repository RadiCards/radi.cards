<template>
  <span>
    <img :src="generateQrCode" alt="qrcode" class="mt-5"/>
  </span>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    name: "QRCodeImage",
    props: ['link'],
    asyncComputed: {
      generateQrCode: function () {
        return QRCode.toDataURL(this.link, {
          margin: 2,
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/variables.scss";
  @import "../../styles/variables.scss";

</style>
