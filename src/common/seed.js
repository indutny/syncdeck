import * as BN from 'bn.js';

export function generate() {
  const seed = new BN(0);
  for (let i = 0; i < 32; i++) {
    seed.ishln(8);
    seed.iaddn((Math.random() * 255) | 0);
  }
  return seed.toString(16);
}
