import * as assert from 'assert';

import { Deck } from '../';

describe('syncdeck', () => {
  it('should create deck from the seed', () => {
    // 256 bits of entropy, while we need only 225.58 bits for full deck
    const s = new Deck(BigInt(
      '38459979191585009824099868035069' +
      '02577339743848002103218857903051' +
      '0515147361659'));

    const cards = [];
    for (;;) {
      const card = s.take();
      if (!card) {
        break;
      }
      cards.push(card.toString());
    }
    assert.strictEqual(cards.join(''),
      '🃚🃝🃙🃌🂱🂪🂧🂨🂲🃗🃑🂹🃊🂫🃉🃒🂶🃘🃈🃓🃁🃔🂦🂭🂣🃛🂢🂷🂥🃖🂡🂤🂳🃍🂸🂻🂩🃅🂼🃕🃃🂵🂽🃋🂺🃜🂬🃂🃆🃇🂴🃄');
  });

  it('should change deck with least-significant bits changes', () => {
    // 256 bits of entropy, while we need only 225.58 bits for full deck
    const s = new Deck(BigInt(
      '38459979191585009824099868035069' +
      '02577339743848002103218857903051' +
      '0515147361658'));

    const cards = [];
    for (;;) {
      const card = s.take();
      if (!card) {
        break;
      }
      cards.push(card.toString());
    }
    assert.strictEqual(cards.join(''),
      '🃊🃝🃙🃌🂱🂪🂧🂨🂲🃗🃑🂹🃚🂫🃉🃒🂶🃘🃈🃓🃁🃔🂦🂭🂣🃛🂢🂷🂥🃖🂡🂤🂳🃍🂸🂻🂩🃅🂼🃕🃃🂵🂽🃋🂺🃜🂬🃂🃆🃇🂴🃄');
  });
});
