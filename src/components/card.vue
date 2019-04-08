<template>
  <div :class="`card card-${rank}-${suit}`" :style="cardStyle">
  </div>
</template>

<script>
export default {
  name: 'Card',

  props: { card: Object },

  computed: {
    cardStyle() {
      const x = 100 * (14 - this.rank);
      const y = -150 * this.suit;
      return {
        'background-position': `${x}px ${y}px`,
      };
    },

    rank() {
      return this.card ? this.card.rank : 1;
    },

    suit() {
      return this.card ? this.card.suit : 4;
    },
  }
}
</script>

<style scoped>
.card {
  display: inline-block;
  background-image: url('/images/deck.svg');
  width: 100px;
  height: 150px;
  margin-right: 0.25rem;
}
</style>
