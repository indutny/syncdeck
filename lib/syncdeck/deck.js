import Card from './card';

export default class Deck {
  constructor(seed) {
    const cards = [];
    for (let i = 0; i < 52; i++) {
      cards.push(i);
    }

    const deck = [];
    for (let i = 52n; i > 0n; i--) {
      const index = Number(seed % i);
      seed /= i;

      deck.push(cards[index]);
      cards.splice(index, 1);
    }
    this.deck = deck;
  }

  take() {
    if (this.deck.length === 0) {
      return null;
    }
    return new Card(this.deck.shift());
  }
}
