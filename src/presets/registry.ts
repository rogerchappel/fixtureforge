import type { FileSpec, FixtureSpec, PresetName } from '../types.js';

function file(path: string, content: string): FileSpec {
  return { path, content };
}

export const presetNames: PresetName[] = ['node-cli', 'polyrepo', 'messy-config', 'secret-ish', 'broken-files'];

export const presetDescriptions: Record<PresetName, string> = {
  'node-cli': 'Small TypeScript CLI project with package metadata, source, tests, and README.',
  polyrepo: 'Multiple packages/apps with shared config and varied manifests.',
  'messy-config': 'Overlapping config files, comments, legacy names, and invalid-ish settings.',
  'secret-ish': 'Fake credentials and private-looking files for scanner tests.',
  'broken-files': 'Malformed JSON, odd filenames, binary blobs, and edge-case content.'
};

export function getPreset(name: PresetName): FixtureSpec {
  switch (name) {
    case 'node-cli':
      return {
        directories: ['src', 'test', 'bin'],
        files: [
          file('package.json', '{"name":"demo-cli","type":"module","bin":{"demo":"bin/demo.js"}}\n'),
          file('src/index.ts', 'export function greet(name = "world") { return `hello ${name}`; }\n'),
          file('bin/demo.js', '#!/usr/bin/env node\nconsole.log("demo cli")\n'),
          file('test/index.test.ts', 'import test from "node:test";\ntest("demo", () => {});\n'),
          file('README.md', '# demo-cli\n\nA tiny generated CLI fixture.\n')
        ]
      };
    case 'polyrepo':
      return {
        directories: ['apps/web', 'apps/worker', 'packages/core', 'packages/ui'],
        files: [
          file('package.json', '{"private":true,"workspaces":["apps/*","packages/*"]}\n'),
          file('apps/web/package.json', '{"name":"@demo/web"}\n'),
          file('apps/worker/package.json', '{"name":"@demo/worker"}\n'),
          file('packages/core/package.json', '{"name":"@demo/core"}\n'),
          file('packages/ui/package.json', '{"name":"@demo/ui"}\n'),
          file('pnpm-workspace.yaml', 'packages:\n  - apps/*\n  - packages/*\n')
        ]
      };
    case 'messy-config':
      return {
        warnings: ['contains conflicting config files', 'contains intentionally malformed settings'],
        files: [
          file('.eslintrc', '{"extends":"standard"}\n'),
          file('.eslintrc.json', '{"extends":["recommended"],"rules":{"semi":"off"}}\n'),
          file('tsconfig.json', '{"compilerOptions":{"strict":true},}\n'),
          file('config/default.json', '{"port":3000}\n'),
          file('config/local.json', '{"port":"three thousand"}\n'),
          file('legacy config.ini', '[main]\npath = ./src\n')
        ]
      };
    case 'secret-ish':
      return {
        warnings: ['contains fake secret-looking values; do not use as real credentials'],
        files: [
          file('.env', 'AWS_ACCESS_KEY_ID=AKIAFAKEEXAMPLE\nAPI_TOKEN=fixtureforge-not-real\n'),
          file('secrets/README.md', 'These are fake credentials for scanner tests.\n'),
          file('secrets/private.key', '-----BEGIN PRIVATE KEY-----\nFAKE-TEST-KEY\n-----END PRIVATE KEY-----\n'),
          file('src/config.js', 'export const token = "ghp_fixtureforge_fake_token";\n')
        ]
      };
    case 'broken-files':
      return {
        warnings: ['contains intentionally broken and unusual files'],
        files: [
          file('broken.json', '{ "missing": "brace"\n'),
          file('odd names/space file.txt', 'spaces are valid\n'),
          file('odd names/unicode-λ.txt', 'lambda\n'),
          { path: 'binary/blob.bin', binary: true, bytes: 32 },
          { path: 'large-ish.txt', lines: 64 }
        ],
        symlinks: [{ path: 'links/readme-link.md', target: '../README.md' }]
      };
  }
}

export function mergeSpecs(base: FixtureSpec, extra: FixtureSpec): FixtureSpec {
  return {
    name: base.name ?? extra.name,
    seed: base.seed ?? extra.seed,
    presets: [...(base.presets ?? []), ...(extra.presets ?? [])],
    directories: [...(base.directories ?? []), ...(extra.directories ?? [])],
    files: [...(base.files ?? []), ...(extra.files ?? [])],
    symlinks: [...(base.symlinks ?? []), ...(extra.symlinks ?? [])],
    warnings: [...(base.warnings ?? []), ...(extra.warnings ?? [])]
  };
}
