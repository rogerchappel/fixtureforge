import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildFixture } from '../src/core/builder.js';
import { validateFixture } from '../src/core/validator.js';

test('validates a clean generated fixture', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-valid-'));
  const built = await buildFixture({ files: [{ path: 'ok.txt', content: 'ok\n' }] }, root);
  const result = await validateFixture(root, built.manifestPath);
  assert.equal(result.ok, true);
});

test('reports changed and extra files', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fixtureforge-drift-'));
  const built = await buildFixture({ files: [{ path: 'ok.txt', content: 'ok\n' }] }, root);
  await fs.writeFile(path.join(root, 'ok.txt'), 'changed\n');
  await fs.writeFile(path.join(root, 'extra.txt'), 'extra\n');
  const result = await validateFixture(root, built.manifestPath);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.kind === 'changed'));
  assert.ok(result.issues.some((issue) => issue.kind === 'extra'));
});
