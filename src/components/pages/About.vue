<template>
  <section class="section section--about">

    <h2>About</h2>

    <h3>🎁 RadiWhatNows?</h3>

    <p>RadiCards lets you send crypto-ecards to your friends and family.</p>

    <p>What are crypto-ecards? A new type of digital good, built on a Ethereum and IPFS.</p>

    <p>We’re open source, not for profit, designed and built entirely by a decentralised team of passionate volunteers from the Ethereum community.</p>
    <p>RadiCards started a few weeks back before Christmas ’18.
      In January ’19 we've joined forces with CryptoXmas. 
      We believe in a power of collaboration and know that only by committing to it, we will achieve a much bigger impact on our actions.</p>
    <br><br>
    <h3>🤔 But why?</h3>

    <p>Aside from the fact that we know you're probably wanting an excuse to bring up blockchain at [INSERT HOLIDAY] dinner, now more than ever we need to raise awareness and support the fight for freedom around the world.</p>

    <p><ul>
      <li>freedom from war (humanitarian projects)</li>
      <li>freedom from Internet surveillance (online privacy rights projects)</li>
      <li>freedom from extinction (environmental projects)</li>
    </ul></p>

    <p>We’re also aiming to help speed up the adoption of Web3 technologies, because we think decentralisation is neat.</p>
    <br><br>
    <h3>🛠️️ What’s next?</h3>

    <p>You’d best believe this is just the beginning. We’ve got some pretty neat updates coming soon: </p>

    <p><ul>
      <li>We’re building a special edition of RadiCards to celebrate Chinese New Year!</li>
      <li>Integrating volca to make possible and send a crypto-ecard to those without a wallet</li>
      <li>More updates are coming. Stay tuned!</li>
    </ul></p>

    <p>If you’d like to help buidl, want donate some art/memes/cat pictures or get your non-profit onto the RadiCards platform, drop us a line at <span><a href="mailto:radicals@radi.cards">radicals@radi.cards </a></span>or in <span><a href="https://t.me/RadiCards">our Telegram group!</a></span></p>

  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";

export default {
  name: "about",
  computed: {},
  created() {}
};
</script>

<style lang="scss" scoped>
.section--about {
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
