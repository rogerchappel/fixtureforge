import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSpecPath, resolveInside } from '../src/core/path-safety.js';

test('normalizes safe relative paths', () => {
  assert.equal(normalizeSpecPath('a/b/c.txt'), 'a/b/c.txt');
  assert.equal(normalizeSpecPath('a\\b.txt'), 'a/b.txt');
});

test('rejects traversal and absolute paths', () => {
  assert.throws(() => normalizeSpecPath('../escape.txt'), /parent/);
  assert.throws(() => normalizeSpecPath('/tmp/escape.txt'), /relative/);
  assert.throws(() => resolveInside('/tmp/root', '../escape.txt'), /parent/);
});
