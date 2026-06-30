# fixtureforge

Deterministic local-first file-tree fixtures for CLI tests. `fixtureforge` stamps out tiny fake repositories with realistic edge cases — package manifests, messy configs, fake secrets, broken files, binary blobs, odd names, and manifests you can validate later.


## Quickstart

Run the tool from a fresh checkout:

```sh
npm install
npm run build
node dist/src/cli.js --help
npm test
```

The help command confirms the CLI entrypoint is reachable, and `npm test` runs the committed regression suite before you rely on the output.

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
fixtureforge --version
```

Generated fixtures are deterministic: the same spec and seed produce the same files and manifest.

For a docs-and-agent-workspace example, see [`examples/agent-docs-pack.json`](examples/agent-docs-pack.json) and the tutorial in [`docs/tutorials/build-agent-doc-fixture.md`](docs/tutorials/build-agent-doc-fixture.md).

## Verification

Run the full local gate before changing fixture generation or package contents:

```bash
npm run release:check
```

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
- `fixtureforge version` / `fixtureforge --version` — print the installed package version.

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

## Release readiness

Before opening a release PR, run the same checks that CI runs:

```sh
npm run release:check
npm pack --dry-run
```

The package smoke installs the generated tarball into a temporary app, checks
the installed `fixtureforge` binary, and validates a generated fixture from the
packaged examples before tagging or publishing.

## License

MIT
