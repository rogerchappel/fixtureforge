import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { main } from '../src/cli.js';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

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

test('CLI reports the package version', async () => {
  const writes: string[] = [];
  const originalLog = console.log;
  console.log = (message?: unknown) => {
    writes.push(String(message));
  };
  try {
    assert.equal(await main(['--version']), 0);
    assert.equal(writes.at(-1), version);
    assert.equal(await main(['version']), 0);
    assert.equal(writes.at(-1), version);
  } finally {
    console.log = originalLog;
  }
});
