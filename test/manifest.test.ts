import assert from 'node:assert/strict';
import test from 'node:test';
import { createManifest, deterministicGeneratedAt } from '../src/core/manifest.js';

test('manifest entries and warnings are sorted deterministically', () => {
  const manifest = createManifest('x', 'seed', [
    { path: 'z.txt', type: 'file', size: 1, sha256: 'z' },
    { path: 'a.txt', type: 'file', size: 1, sha256: 'a' }
  ], ['b warning', 'a warning', 'b warning']);
  assert.equal(manifest.generatedAt, deterministicGeneratedAt);
  assert.deepEqual(manifest.entries.map((entry) => entry.path), ['a.txt', 'z.txt']);
  assert.deepEqual(manifest.warnings, ['a warning', 'b warning']);
});
