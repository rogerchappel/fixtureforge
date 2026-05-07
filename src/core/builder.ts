import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildResult, FixtureSpec, ManifestEntry } from '../types.js';
import { getPreset, mergeSpecs } from '../presets/registry.js';
import { renderFileContent } from './content.js';
import { createManifest, directoryEntry, fileEntry, symlinkEntry, writeManifest } from './manifest.js';
import { normalizeSpecPath, resolveInside } from './path-safety.js';
import { validateSpec } from './spec.js';

export async function buildFixture(inputSpec: FixtureSpec, outdir: string): Promise<BuildResult> {
  const spec = expandSpec(validateSpec(inputSpec));
  const root = path.resolve(outdir);
  await fs.mkdir(root, { recursive: true });
  const entries: ManifestEntry[] = [];

  const directories = new Set<string>(spec.directories ?? []);
  for (const file of spec.files ?? []) {
    const parent = path.posix.dirname(file.path);
    if (parent !== '.') directories.add(parent);
  }
  for (const link of spec.symlinks ?? []) {
    const parent = path.posix.dirname(link.path);
    if (parent !== '.') directories.add(parent);
  }

  for (const dir of [...directories].sort()) {
    const normalized = normalizeSpecPath(dir);
    await fs.mkdir(resolveInside(root, normalized), { recursive: true });
    entries.push(await directoryEntry(root, normalized));
  }

  for (const file of [...(spec.files ?? [])].sort((a, b) => a.path.localeCompare(b.path))) {
    const absolute = resolveInside(root, file.path);
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    await fs.writeFile(absolute, renderFileContent(file, String(spec.seed ?? 'fixtureforge')));
    if (file.executable) await fs.chmod(absolute, 0o755);
    entries.push(await fileEntry(root, file.path, Boolean(file.executable)));
  }

  for (const link of [...(spec.symlinks ?? [])].sort((a, b) => a.path.localeCompare(b.path))) {
    const absolute = resolveInside(root, link.path);
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    await fs.rm(absolute, { force: true });
    try {
      await fs.symlink(link.target, absolute);
      entries.push(await symlinkEntry(root, link.path));
    } catch (error) {
      spec.warnings = [...(spec.warnings ?? []), `could not create symlink ${link.path}: ${error instanceof Error ? error.message : String(error)}`];
    }
  }

  const manifest = createManifest(spec.name ?? 'fixture', String(spec.seed ?? 'fixtureforge'), entries, spec.warnings ?? []);
  const manifestPath = await writeManifest(root, manifest);
  return { outdir: root, manifestPath, manifest };
}

export function expandSpec(spec: FixtureSpec): FixtureSpec {
  let expanded: FixtureSpec = { ...spec, presets: [] };
  for (const preset of spec.presets ?? []) expanded = mergeSpecs(expanded, getPreset(preset));
  return validateSpec(expanded);
}
