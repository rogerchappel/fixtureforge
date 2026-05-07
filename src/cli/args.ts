export interface ParsedArgs {
  command?: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index]!;
    if (token.startsWith('--')) {
      const [rawKey, inline] = token.slice(2).split('=', 2);
      if (!rawKey) continue;
      if (inline !== undefined) flags[rawKey] = inline;
      else if (rest[index + 1] && !rest[index + 1]!.startsWith('-')) flags[rawKey] = rest[++index]!;
      else flags[rawKey] = true;
    } else {
      positionals.push(token);
    }
  }

  return { command, positionals, flags };
}

export function flagString(flags: Record<string, string | boolean>, name: string, fallback?: string): string | undefined {
  const value = flags[name];
  return typeof value === 'string' ? value : fallback;
}
