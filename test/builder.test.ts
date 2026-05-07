import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildFixture } from '../src/core/builder.js';

test('builds deterministic fixture manifests', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-build-'));
  const spec = { name: 'determinism', seed: 'same', files: [{ path: 'a.txt', lines: 3 }, { path: 'b.json', json: { b: 1, a: 2 } }] };
  const one = await buildFixture(spec, path.join(root, 'one'));
  const two = await buildFixture(spec, path.join(root, 'two'));
  assert.deepEqual(one.manifest.entries, two.manifest.entries);
});

test('builds built-in presets', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-preset-'));
  const result = await buildFixture({ name: 'preset', seed: 'x', presets: ['node-cli', 'secret-ish'] }, root);
  assert.ok(result.manifest.entries.some((entry) => entry.path === 'package.json'));
  assert.ok(result.manifest.warnings.some((warning) => warning.includes('fake secret')));
});

test('clean builds remove stale files', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-clean-'));
  await fs.writeFile(path.join(root, 'stale.txt'), 'stale\n');
  await buildFixture({ files: [{ path: 'fresh.txt', content: 'fresh\n' }] }, root, { clean: true });
  await assert.rejects(() => fs.stat(path.join(root, 'stale.txt')));
  assert.equal(await fs.readFile(path.join(root, 'fresh.txt'), 'utf8'), 'fresh\n');
});
