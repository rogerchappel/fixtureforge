import { FixtureForgeError } from './errors.js';

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((part) => parseScalar(part));
  }
  return value;
}

export function parseSimpleYaml(text: string): unknown {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'));
  const root: Record<string, unknown> = {};
  let currentKey: string | undefined;
  let currentItem: Record<string, unknown> | undefined;

  for (const line of lines) {
    const indent = line.match(/^ */)?.[0].length ?? 0;
    const trimmed = line.trim();

    if (indent === 0) {
      currentItem = undefined;
      const match = trimmed.match(/^([^:]+):(.*)$/);
      if (!match) throw new FixtureForgeError('E_YAML_PARSE', `Unsupported YAML line: ${line}`);
      const key = match[1]!.trim();
      const rest = match[2]!.trim();
      currentKey = key;
      root[key] = rest === '' ? [] : parseScalar(rest);
      continue;
    }

    if (!currentKey) throw new FixtureForgeError('E_YAML_PARSE', `Indented YAML line has no parent: ${line}`);
    const current = root[currentKey];
    if (!Array.isArray(current)) throw new FixtureForgeError('E_YAML_PARSE', `YAML parent is not a list: ${currentKey}`);

    if (trimmed.startsWith('- ')) {
      const itemText = trimmed.slice(2);
      if (itemText.includes(':')) {
        const [key, ...restParts] = itemText.split(':');
        currentItem = { [key!.trim()]: parseScalar(restParts.join(':')) };
        current.push(currentItem);
      } else {
        currentItem = undefined;
        current.push(parseScalar(itemText));
      }
      continue;
    }

    if (!currentItem) throw new FixtureForgeError('E_YAML_PARSE', `YAML property has no list object: ${line}`);
    const match = trimmed.match(/^([^:]+):(.*)$/);
    if (!match) throw new FixtureForgeError('E_YAML_PARSE', `Unsupported YAML property: ${line}`);
    currentItem[match[1]!.trim()] = parseScalar(match[2]!.trim());
  }

  return root;
}

export function toSimpleYaml(value: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [key, item] of Object.entries(value)) {
    if (Array.isArray(item)) {
      lines.push(`${key}:`);
      for (const entry of item) {
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          const entries = Object.entries(entry as Record<string, unknown>);
          const [firstKey, firstValue] = entries.shift()!;
          lines.push(`  - ${firstKey}: ${String(firstValue)}`);
          for (const [childKey, childValue] of entries) lines.push(`    ${childKey}: ${String(childValue)}`);
        } else {
          lines.push(`  - ${String(entry)}`);
        }
      }
    } else {
      lines.push(`${key}: ${String(item)}`);
    }
  }
  return `${lines.join('\n')}\n`;
}
