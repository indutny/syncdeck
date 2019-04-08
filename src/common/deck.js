import Card from './card';

export default class Deck {
  constructor(seed) {
    const cards = [];
    for (let i = 0; i < 52; i++) {
      cards.push(i);
    }

    const deck = [];
    for (let i = 52; i > 0; i--) {
      const index = seed.modn(i);
      seed.idivn(i);

      deck.push(cards[index]);
      cards.splice(index, 1);
    }
    this.deck = deck;
  }

  isEmpty() {
    return this.deck.length === 0;
  }

  take() {
    if (this.isEmpty()) {
      return null;
    }
    return new Card(this.deck.shift());
  }

  takeLast() {
    if (this.isEmpty()) {
      return null;
    }
    return new Card(this.deck.pop());
  }

  entropy() {
    let res = 0;
    for (let i = 1; i <= 52 - this.deck.length; i++) {
      res += Math.log2(i);
    }
    return res;
  }
}
