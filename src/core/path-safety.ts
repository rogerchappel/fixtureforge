import path from 'node:path';
import { FixtureForgeError } from './errors.js';

const badSegments = new Set(['', '.', '..']);

export function normalizeSpecPath(input: string): string {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new FixtureForgeError('E_PATH_EMPTY', 'Fixture paths must be non-empty strings.');
  }
  if (input.includes('\0')) throw new FixtureForgeError('E_PATH_NULL', `Unsafe path contains null byte: ${input}`);
  if (path.isAbsolute(input)) throw new FixtureForgeError('E_PATH_ABSOLUTE', `Fixture path must be relative: ${input}`);
  const unix = input.replaceAll('\\', '/');
  const parts = unix.split('/');
  if (parts.some((part) => badSegments.has(part))) {
    throw new FixtureForgeError('E_PATH_TRAVERSAL', `Fixture path cannot contain empty, current, or parent segments: ${input}`);
  }
  return parts.join('/');
}

export function resolveInside(root: string, relativePath: string): string {
  const normalized = normalizeSpecPath(relativePath);
  const absoluteRoot = path.resolve(root);
  const resolved = path.resolve(absoluteRoot, normalized);
  const relative = path.relative(absoluteRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new FixtureForgeError('E_PATH_ESCAPE', `Refusing to write outside output directory: ${relativePath}`);
  }
  return resolved;
}

export function sortPaths<T extends { path: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.path.localeCompare(b.path));
}
