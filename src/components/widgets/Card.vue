<template>

  <div :class="['card', {'card--flipped': isFlipped}]" @click="flip">

    <figure class="card__front">
      <div class="card__image">
        <img src="" alt="" />
      </div>
      <figcaption>
        <div class="card__meta">
          <h4 class="title">Artwork name</h4>
          <p class="creator">Artist name</p>
          <p class="descr">Artwork description</p>
        </div>
        <div class="card__value">
          <div class="badge">0.5 ETH</div>
          <div class="help"><img src="/static/icons/flip.svg" alt="" />Flip</div>
        </div>
      </figcaption>
    </figure>

    <div class="card__back">
      <p>
        This is the personal message! Go NFT!
        <br/><br/>
        &mdash; Vitalik
      </p>
    </div>

  </div>

</template>

<script>
  /* global web3:true */

  import {mapState} from 'vuex';

  export default {

    name: 'card',

    computed: {
      ...mapState(['card']),
    },

    data() {
      return {
        isFlipped: false
      }
    },

    methods: {
      flip: function(event) {
        this.isFlipped = !this.isFlipped;
      }
    }
  }
</script>

<style lang="scss" scoped>

@import "../../styles/variables.scss";
@import "../../styles/variables.scss";

// Card
.card {
  $p_v: 1rem;
  $p_h: 1.5rem;

  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
  width: 18rem;
  max-width: 18rem;
  margin-right: 1rem;
  padding: $p_v $p_h;

  box-shadow: 0 0.25rem 1rem rgba($black, 0.1);
  background: $white;
  cursor: ew-resize;
  cursor: alias;

  transition: all 0.2s ease-in-out;
  transition: all 1s cubic-bezier(0.4, 0.0, 0.2, 1);
  // perspective: 1000px;
  transform-style: preserve-3d;

  // &:hover {
  //   box-shadow: 0 0.25rem 1.5rem rgba($black, 0.2);
  //   border-bottom: none;
  //   transform: scale(1.01);
  //   transform-style: preserve-3d;
  // }

  // Flip effect
  &--flipped {
    transform: rotateY(-180deg);
    transform-style: preserve-3d;

    // &:hover { transform: scale(1.01) rotateY(180deg); }
  }

  &__front, &__back {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  figure { display: block; width: 100%; }

  &__image {
    flex: 1;
    min-height: 12rem;
    margin: -#{$p_v} -#{$p_h} $p_v;
    background: $greylight;
  }

  .card__image img {
    min-height: 5rem;
    background: $gray;
  }

  figcaption {
    display: flex;
  }

  &__meta {
    flex: 1;
  }

  &__value {
    flex: 0;
  }

  // Content
  .title { font-size: 1.125rem; }
  .creator {}
  .descr { margin-top: 0.5rem; font-size: 0.875rem; color: $gray; }

  .badge {
    display: inline-block;
    margin-right: -$p_h;
    padding: 0.75rem 0.5rem;
    background: $black;
    color: $white;
    white-space: nowrap;
    font-weight: bold;
  }

  .help {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex: 0;
    align-items: center;
    margin: 0 -#{$p_h/2} -#{$p_v/2} 0;

    font-size: 0.75rem;
    opacity: 0.2;

    &:hover { opacity: 0.4; }

    img {
      width: 0.875rem;
      margin-right: 0.25rem;
    }
  }

  // Card back side
  &__back {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    padding: $p_v $p_h;
    background: $greylightest;
    transform: rotateY(180deg);

    cursor: w-resize;
  }
}
</style>
