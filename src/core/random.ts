import { sha256 } from './hash.js';

export class SeededRandom {
  private state: number;

  constructor(seed: string | number = 'fixtureforge') {
    const digest = sha256(String(seed));
    this.state = Number.parseInt(digest.slice(0, 8), 16) || 0x9e3779b9;
  }

  next(): number {
    let x = this.state >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0xffffffff;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)]!;
  }

  word(): string {
    const adjectives = ['amber', 'brisk', 'cosmic', 'dented', 'ember', 'fuzzy', 'glacial', 'hidden'];
    const nouns = ['anvil', 'branch', 'canyon', 'delta', 'engine', 'forge', 'glyph', 'harbor'];
    return `${this.pick(adjectives)}-${this.pick(nouns)}-${this.int(10, 99)}`;
  }
}
