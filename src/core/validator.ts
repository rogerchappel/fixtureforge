import fs from 'node:fs/promises';
import path from 'node:path';
import type { FixtureManifest, ManifestEntry, ValidationIssue, ValidationResult } from '../types.js';
import { sha256 } from './hash.js';
import { readManifest } from './manifest.js';
import { resolveInside } from './path-safety.js';

export async function validateFixture(outdir: string, manifestPath: string): Promise<ValidationResult> {
  const root = path.resolve(outdir);
  const manifest = await readManifest(manifestPath);
  const issues: ValidationIssue[] = [];
  const expectedPaths = new Set(manifest.entries.map((entry) => entry.path));

  for (const entry of manifest.entries) {
    await checkEntry(root, entry, issues);
  }

  for (const extra of await walk(root)) {
    const relative = extra.split(path.sep).join('/');
    if (relative === path.basename(manifestPath) || relative === '.fixtureforge-manifest.json') continue;
    if (!expectedPaths.has(relative)) issues.push({ path: relative, kind: 'extra', message: `Unexpected path: ${relative}` });
  }

  return { ok: issues.length === 0, checked: manifest.entries.length, issues };
}

async function checkEntry(root: string, entry: ManifestEntry, issues: ValidationIssue[]): Promise<void> {
  const absolute = resolveInside(root, entry.path);
  let stat;
  try {
    stat = await fs.lstat(absolute);
  } catch {
    issues.push({ path: entry.path, kind: 'missing', message: `Missing ${entry.type}: ${entry.path}` });
    return;
  }

  if (entry.type === 'file') {
    if (!stat.isFile()) {
      issues.push({ path: entry.path, kind: 'type', message: `Expected file: ${entry.path}` });
      return;
    }
    const bytes = await fs.readFile(absolute);
    if (bytes.length !== entry.size || sha256(bytes) !== entry.sha256) {
      issues.push({ path: entry.path, kind: 'changed', message: `File drifted: ${entry.path}` });
    }
    return;
  }

  if (entry.type === 'directory') {
    if (!stat.isDirectory()) issues.push({ path: entry.path, kind: 'type', message: `Expected directory: ${entry.path}` });
    return;
  }

  if (!stat.isSymbolicLink()) {
    issues.push({ path: entry.path, kind: 'type', message: `Expected symlink: ${entry.path}` });
    return;
  }
  const target = await fs.readlink(absolute);
  if (target !== entry.target) issues.push({ path: entry.path, kind: 'changed', message: `Symlink drifted: ${entry.path}` });
}

async function walk(root: string, base = ''): Promise<string[]> {
  const absolute = path.join(root, base);
  const items = await fs.readdir(absolute, { withFileTypes: true });
  const paths: string[] = [];
  for (const item of items) {
    const relative = path.join(base, item.name);
    paths.push(relative);
    if (item.isDirectory()) paths.push(...await walk(root, relative));
  }
  return paths;
}

export function summarizeValidation(result: ValidationResult): string {
  if (result.ok) return `Fixture is valid (${result.checked} entries checked).`;
  return [`Fixture drift detected (${result.issues.length} issue${result.issues.length === 1 ? '' : 's'}).`, ...result.issues.map((issue) => `- ${issue.kind}: ${issue.message}`)].join('\n');
}

export type { FixtureManifest };
