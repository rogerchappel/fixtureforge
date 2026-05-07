import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadSpec, validateSpec, writeDefaultSpec } from '../src/core/spec.js';

test('validates presets and file paths', () => {
  const spec = validateSpec({ presets: ['node-cli'], files: [{ path: 'ok.txt', content: 'ok' }] });
  assert.deepEqual(spec.presets, ['node-cli']);
  assert.equal(spec.files?.[0]?.path, 'ok.txt');
});

test('writes and loads JSON default spec', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-spec-'));
  const specPath = path.join(dir, 'fixtureforge.json');
  await writeDefaultSpec(specPath);
  const spec = await loadSpec(specPath);
  assert.equal(spec.name, 'demo-fixture');
  assert.deepEqual(spec.presets, ['node-cli']);
});

test('rejects duplicate output paths across entry kinds', () => {
  assert.throws(() => validateSpec({ directories: ['same'], files: [{ path: 'same', content: 'x' }] }), /Duplicate fixture path/);
});
