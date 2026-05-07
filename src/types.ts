export type PresetName = 'node-cli' | 'polyrepo' | 'messy-config' | 'secret-ish' | 'broken-files';

export interface FixtureSpec {
  name?: string;
  seed?: string | number;
  presets?: PresetName[];
  files?: FileSpec[];
  directories?: string[];
  symlinks?: SymlinkSpec[];
  warnings?: string[];
}

export interface FileSpec {
  path: string;
  content?: string;
  bytes?: number;
  lines?: number;
  binary?: boolean;
  executable?: boolean;
  json?: unknown;
}

export interface SymlinkSpec {
  path: string;
  target: string;
}

export interface ManifestEntry {
  path: string;
  type: 'file' | 'directory' | 'symlink';
  size: number;
  sha256?: string;
  target?: string;
  executable?: boolean;
}

export interface FixtureManifest {
  version: 1;
  name: string;
  seed: string;
  generatedAt: string;
  entries: ManifestEntry[];
  warnings: string[];
}

export interface BuildResult {
  outdir: string;
  manifestPath: string;
  manifest: FixtureManifest;
}

export interface ValidationIssue {
  path: string;
  kind: 'missing' | 'changed' | 'extra' | 'type' | 'unsafe';
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  checked: number;
  issues: ValidationIssue[];
}
