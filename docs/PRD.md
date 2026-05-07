# fixtureforge

Status: in-progress
Decision: selected for 2026-05-08 OSS factory run

## Scorecard

Total: 81/100
Band: build now
Last scored: 2026-05-08
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 15/20 | CLI projects need small realistic fixtures, but teams either hand-roll chaos or ship brittle golden files. |
| Demand signal | 15/20 | Testing libraries, snapshot tools, and generator utilities prove repeatable test data demand. |
| V1 buildability | 19/20 | Template expansion, deterministic random data, tree manifests, and fixture validation are tractable. |
| Differentiation | 13/15 | Repo/file-tree fixture generation specifically for developer tools and coding agents. |
| Agentic workflow leverage | 12/15 | Agents can quickly create scenario fixtures before implementing parser/scanner CLIs. |
| Distribution potential | 7/10 | Useful, memorable, demo-friendly. |

## Pitch

`fixtureforge` stamps out deterministic miniature repositories and file trees for CLI tests — tiny fake worlds with real edge cases. 🔨

## Why It Matters

Developer tools need fixtures: nested repos, bad configs, symlinks, weird filenames, large files, binary blobs, package manifests, and broken JSON. Creating them by hand slows down MVPs and makes tests inconsistent.

## Attribution / Inspiration

Inspired by test fixture generators and project scaffolding CLIs; implementation should be original and local-only.

## V1 Scope

- TypeScript CLI package.
- `fixtureforge init` creates a fixture spec file.
- `fixtureforge build <spec> <outdir>` creates deterministic trees from YAML/JSON specs.
- Built-in presets: `node-cli`, `polyrepo`, `messy-config`, `secret-ish`, `broken-files`.
- Deterministic seeded content generation.
- Manifest with file paths, sizes, checksums, and expected warnings.
- `fixtureforge validate <outdir> --manifest <manifest>` checks fixture drift.
- Tests for presets, determinism, validation failures, and path safety.
- README with copy-paste examples for CLI projects.

## Out of Scope

- Fuzzing engine, huge data generation, network calls, package install, or benchmark-scale datasets.

## Verification

- `npm test`
- `npm run check`
- `npm run build`
- `npm run smoke`
- Real CLI smoke building and validating a fixture.

## Agent Prompt

Build a polished local-first TypeScript CLI named `fixtureforge` from this PRD. Keep path safety tight and outputs deterministic. Publish as `rogerchappel/fixtureforge` after verification.
