<template>
  <div>
    <section class="description mb-1">
      <h1>Safety Number verification through a Blackjack game</h1>

      <p>
        Applications like <a href="https://www.signal.org/">Signal</a> provide
        means of secure communication using end-to-end encryption. Although
        cryptography is used to make the content of the chat undecipherable, the
        chats still could be eavesdropped by a malicious third-party if
        users are not careful enough.
      </p>

      <p>
        In order to prevent such Man-in-The-Middle attacks (MiTM) each chat has
        a so called Safety Number. Users are supposed to either meet in person
        or find a secure channel to independently verify that they both have the
        same Safety Number. However, in reality this rarely happens due to
        lack of understanding of importance and dullness of the process.
      </p>

      <p>
        This project is a Proof-of-Concept of gamification of the verification
        process. Instead of checking the Safety Number digit-by-digit, users are
        asked to play a game (Blackjack in this case) on two devices
        simultaneously (likely in person), and verify that they both
        get the same cards when doing the same action.
      </p>

      <p>
        The Safety Number in this case is used to shuffle the deck of card in a
        unique way (the particular order of the deck is equivalent to 225 bits
        of entropy). Thus differences in the security code would result in
        different cards played, and users will have a good chance at spotting
        it.
      </p>

      <button @click.prevent="randomize">Randomize seed</button>
    </section>

    <h3>Verification progress:</h3>
    <progress class="entropy" max="225" :value="entropy"/>

    <section class="table">
      <section class="dealer mb-1">
        <h3>Dealer's hand:</h3>

        <section :class="`score ${state === 'hit' ? 'hidden' : ''}`">
          Score: {{ dealerScore }}
        </section>
        <section class="cards">
          <template v-for="(card, i) in dealer">
            <Card :card="null" :key="i" v-if="i === 0 && state === 'hit'"/>
            <Card :card="card" :key="i" v-else/>
          </template>
        </section>
      </section>

      <section class="player mb-1">
        <h3>Player's hand:</h3>

        <section class="score">
          Score: {{ playerScore }}, Funds: {{ funds }}💰
        </section>
        <section class="cards">
          <Card v-for="(card, i) in player" :key="i" :card="card"/>
        </section>
      </section>

      <section class="buttons">
        <template v-if="state === 'over'">
          All cards used. You verified whole Safety Number.
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
          <button @click.prevent="next">next</button>
        </template>
      </section>
    </section>
  </div>
</template>

<script>
import Deck from '../common/deck';
import { generate } from '../common/seed';
import Card from './card';

import * as BN from 'bn.js';

const INITIAL_FUNDS = 1000;

export default {
  name: 'BlackJack',
  components: { Card },

  data() {
    const seed = new BN(this.$route.params.seed, 16);
    const deck = new Deck(seed);

    return {
      deck,
      state: 'hit',
      funds: INITIAL_FUNDS,
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
        this.funds -= 100;
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
        this.funds -= 100;
      } else if (this.dealerScore === this.playerScore) {
        this.state = 'draw';
      } else {
        this.state = 'win';
        this.funds += 100;
      }
    },

    next() {
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

    randomize() {
      let seed = generate();
      this.$router.replace('/play/' + seed);

      // TODO(indutny): why do we need this?
      seed = new BN(seed, 16);
      const deck = new Deck(seed);
      this.deck = deck;
      this.funds = INITIAL_FUNDS;
      this.state = 'hit';
      this.dealer = [ deck.take(), deck.take() ];
      this.player = [ deck.takeLast(), deck.takeLast() ];
    }
  },

  computed: {
    playerScore() {
      return this.score(this.player);
    },
    dealerScore() {
      return this.score(this.dealer);
    },
    entropy() {
      return this.deck.entropy();
    },
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

.buttons, .description {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.25rem;
}

h3, .score {
  color: white;
}

.entropy {
  width: 100%;
}
</style>
