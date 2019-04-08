export default class Card {
  constructor(value) {
    this.value = value;
    this.suit = value % 4;
    this.rank = Math.floor(value / 4) + 1;
  }

  toString() {
    return '\ud83c' +
      String.fromCharCode(this.rank + 0x10 * this.suit + 0xdca0);
  }
}
