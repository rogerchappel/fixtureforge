import type { FileSpec } from '../types.js';
import { stableStringify } from './hash.js';
import { SeededRandom } from './random.js';

export function renderFileContent(file: FileSpec, seed: string): Buffer {
  if (file.binary) return renderBinary(file, seed);
  if (file.json !== undefined) return Buffer.from(`${stableStringify(file.json)}\n`, 'utf8');
  if (file.content !== undefined) return Buffer.from(file.content, 'utf8');
  if (file.lines !== undefined) return Buffer.from(renderLines(file, seed), 'utf8');
  if (file.bytes !== undefined) return Buffer.from(renderTextBytes(file, seed), 'utf8');
  return Buffer.from('', 'utf8');
}

function renderLines(file: FileSpec, seed: string): string {
  const random = new SeededRandom(`${seed}:${file.path}:lines`);
  const count = file.lines ?? 1;
  return Array.from({ length: count }, (_, index) => `${index + 1}: ${random.word()}`).join('\n') + (count > 0 ? '\n' : '');
}

function renderTextBytes(file: FileSpec, seed: string): string {
  const random = new SeededRandom(`${seed}:${file.path}:bytes`);
  let output = '';
  while (Buffer.byteLength(output, 'utf8') < (file.bytes ?? 0)) output += `${random.word()} `;
  return output.slice(0, file.bytes ?? 0);
}

function renderBinary(file: FileSpec, seed: string): Buffer {
  const random = new SeededRandom(`${seed}:${file.path}:binary`);
  const buffer = Buffer.alloc(file.bytes ?? 16);
  for (let index = 0; index < buffer.length; index += 1) buffer[index] = random.int(0, 255);
  return buffer;
}
