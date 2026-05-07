import fs from 'node:fs/promises';
import path from 'node:path';
import type { FixtureManifest, ManifestEntry } from '../types.js';
import { sha256 } from './hash.js';
import { resolveInside, sortPaths } from './path-safety.js';

export const manifestFileName = '.fixtureforge-manifest.json';
export const deterministicGeneratedAt = '1970-01-01T00:00:00.000Z';

export function createManifest(name: string, seed: string, entries: ManifestEntry[], warnings: string[]): FixtureManifest {
  return {
    version: 1,
    name,
    seed,
    generatedAt: deterministicGeneratedAt,
    entries: sortPaths(entries),
    warnings: [...new Set(warnings)].sort()
  };
}

export async function writeManifest(outdir: string, manifest: FixtureManifest): Promise<string> {
  const manifestPath = path.join(outdir, manifestFileName);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifestPath;
}

export async function readManifest(manifestPath: string): Promise<FixtureManifest> {
  return JSON.parse(await fs.readFile(manifestPath, 'utf8')) as FixtureManifest;
}

export async function fileEntry(root: string, relativePath: string, executable = false): Promise<ManifestEntry> {
  const absolute = resolveInside(root, relativePath);
  const bytes = await fs.readFile(absolute);
  return { path: relativePath, type: 'file', size: bytes.length, sha256: sha256(bytes), executable };
}

export async function directoryEntry(root: string, relativePath: string): Promise<ManifestEntry> {
  const absolute = resolveInside(root, relativePath);
  const stat = await fs.stat(absolute);
  return { path: relativePath, type: 'directory', size: stat.size };
}

export async function symlinkEntry(root: string, relativePath: string): Promise<ManifestEntry> {
  const absolute = resolveInside(root, relativePath);
  const target = await fs.readlink(absolute);
  return { path: relativePath, type: 'symlink', size: Buffer.byteLength(target), target };
}
