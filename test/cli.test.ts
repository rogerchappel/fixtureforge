import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { main } from '../src/cli.js';

test('CLI init build validate flow returns success codes', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-cli-'));
  const spec = path.join(root, 'spec.json');
  const out = path.join(root, 'out');
  assert.equal(await main(['init', spec]), 0);
  assert.equal(await main(['build', spec, out, '--clean']), 0);
  assert.equal(await main(['validate', out, '--manifest', path.join(out, '.fixtureforge-manifest.json')]), 0);
});

test('CLI rejects unknown commands', async () => {
  assert.equal(await main(['wat']), 1);
});
