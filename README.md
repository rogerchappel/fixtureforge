# fixtureforge

Deterministic local-first file-tree fixtures for CLI tests. `fixtureforge` stamps out tiny fake repositories with realistic edge cases — package manifests, messy configs, fake secrets, broken files, binary blobs, odd names, and manifests you can validate later.

## Install

```bash
npm install --save-dev fixtureforge
```

Or run locally from this repo:

```bash
npm install
npm run build
node dist/src/cli.js --help
```

## Quick Start

```bash
fixtureforge init fixtureforge.json
fixtureforge build fixtureforge.json tmp/my-fixture
fixtureforge validate tmp/my-fixture --manifest tmp/my-fixture/.fixtureforge-manifest.json
```

Generated fixtures are deterministic: the same spec and seed produce the same files and manifest.

For a docs-and-agent-workspace example, see [`examples/agent-docs-pack.json`](examples/agent-docs-pack.json) and the tutorial in [`docs/tutorials/build-agent-doc-fixture.md`](docs/tutorials/build-agent-doc-fixture.md).

## Spec Example

```json
{
  "name": "parser-cli-fixture",
  "seed": "parser-v1",
  "presets": ["node-cli", "messy-config"],
  "files": [
    { "path": "samples/input.txt", "lines": 8 },
    { "path": "samples/config.json", "json": { "mode": "strict", "retries": 2 } }
  ]
}
```

YAML is also supported for simple fixture specs:

```yaml
name: scanner-fixture
seed: scanner-v1
presets:
  - secret-ish
  - broken-files
files:
  - path: notes/readme.txt
    content: fake secrets are intentional
```

## Commands

- `fixtureforge init [spec] [--format json|yaml]` — write a starter spec.
- `fixtureforge build <spec> <outdir>` — generate files and `.fixtureforge-manifest.json`.
- `fixtureforge validate <outdir> --manifest <manifest>` — check drift without mutating files.
- `fixtureforge presets` — list built-in presets.

## Built-in Presets

- `node-cli` — small TypeScript CLI project.
- `polyrepo` — multi-package workspace layout.
- `messy-config` — overlapping and malformed config files.
- `secret-ish` — fake credential-looking files for scanner tests.
- `broken-files` — malformed JSON, odd filenames, binary blobs, and symlinks.

## Programmatic API

```ts
import { buildFixture, validateFixture } from 'fixtureforge';

const built = await buildFixture({ seed: 'demo', presets: ['node-cli'] }, 'tmp/demo');
const validation = await validateFixture('tmp/demo', built.manifestPath);
```

## Safety Model

`fixtureforge` is local-only. It makes no network calls at runtime and rejects absolute paths, parent traversal, empty path segments, and null bytes in generated fixture paths.

## Development

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## License

MIT

## Development

Run the same checks locally before opening a change:

```sh
npm ci
npm run check
npm run build
npm test
npm run smoke
npm run package:smoke
npm run release:check
```
