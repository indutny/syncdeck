<template>
  <div>
    <section class="description mb-1">
    </section>

    <section class="table">
      <section class="dealer mb-1">
        <section :class="`score ${state === 'hit' ? 'hidden' : ''}`">
          {{ dealerScore }}
        </section>
        <section class="cards">
          <template v-for="(card, i) in dealer">
            <Card :card="null" :key="i" v-if="i === 0 && state === 'hit'"/>
            <Card :card="card" :key="i" v-else/>
          </template>
        </section>
      </section>

      <section class="player mb-1">
        <section class="score">{{ playerScore }}</section>
        <section class="cards">
          <Card v-for="(card, i) in player" :key="i" :card="card"/>
        </section>
      </section>

      <section class="buttons">
        <template v-if="state === 'over'">
          All cards used
        </template>
        <template v-else-if="state === 'hit'">
          <button @click.prevent="hit">hit</button>
          <button @click.prevent="stand">stand</button>
        </template>
        <template v-else>
          <template v-if="state === 'draw'">
            It's a draw!
          </template>
          <template v-else>
            You {{ state === 'win' ? 'won' : 'lost' }}
          </template>
          <button @click.prevent="restart">restart</button>
        </template>
      </section>
    </section>
  </div>
</template>

<script>
import Deck from '../common/deck';
import Card from './card';

import * as BN from 'bn.js';

export default {
  name: 'BlackJack',
  components: { Card },

  data() {
    const seed = new BN(this.$route.params.seed, 16);
    const deck = new Deck(seed);

    return {
      deck,
      state: 'hit',
      dealer: [ deck.take(), deck.take() ],
      player: [ deck.takeLast(), deck.takeLast() ],
    };
  },

  methods: {
    hit() {
      if (this.state !== 'hit') {
        return;
      }

      const card = this.deck.takeLast();
      if (!card) {
        this.state = 'over';
        return;
      }
      this.player.push(card);

      if (this.playerScore === 21) {
        return this.stand();
      } else if (this.playerScore > 21) {
        this.state = 'lose';
      }
    },

    stand() {
      if (this.state !== 'hit') {
        return;
      }

      while (this.dealerScore < this.playerScore) {
        const card = this.deck.take();
        if (!card) {
          this.state = 'over';
          return;
        }

        this.dealer.push(card);
      }

      if (this.dealerScore <= 21 &&
          this.dealerScore > this.playerScore) {
        this.state = 'lose';
      } else if (this.dealerScore === this.playerScore) {
        this.state = 'draw';
      } else {
        this.state = 'win';
      }
    },

    restart() {
      if (this.state === 'over') {
        return;
      }

      this.state = 'hit';
      this.dealer = [];
      this.player = [];

      for (let i = 0; i < 4; i++) {
        let card = i < 2 ? this.deck.take() : this.deck.takeLast();
        if (!card) {
          this.state = 'over';
          return;
        }

        if (i < 2) {
          this.dealer.push(card);
        } else {
          this.player.push(card);
        }
      }
    },

    score(cards) {
      let sum = 0;
      let aces = 0;
      for (const card of cards) {
        if (card.rank === 1) {
          aces++;
        }
        sum += Math.min(card.rank, 10);
      }

      // Ace is either 1 or 11
      if (aces >= 1 && sum === 11) {
        return 21;
      }

      return sum;
    },
  },

  computed: {
    playerScore() {
      return this.score(this.player);
    },
    dealerScore() {
      return this.score(this.dealer);
    }
  }
}
</script>

<style scoped>
.hidden {
  visibility: hidden;
}

.mb-1 {
  margin-bottom: 0.25rem;
}
</style>
