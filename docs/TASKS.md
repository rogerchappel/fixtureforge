# fixtureforge MVP Tasks

## Product

- [x] Preserve PRD scope and verification requirements.
- [x] Define orchestration plan and machine-readable milestone file.
- [x] Document local-first security and path-safety constraints.

## CLI

- [x] `fixtureforge init` writes a starter JSON or YAML spec.
- [x] `fixtureforge build <spec> <outdir>` builds deterministic fixture trees.
- [x] `fixtureforge validate <outdir> --manifest <manifest>` detects drift.
- [x] `fixtureforge presets` lists built-in presets.
- [x] Support JSON and YAML specs.
- [x] Generate manifests with paths, sizes, sha256 hashes, and warnings.

## Presets

- [x] `node-cli`
- [x] `polyrepo`
- [x] `messy-config`
- [x] `secret-ish`
- [x] `broken-files`

## Quality

- [x] Unit tests for deterministic builds, presets, validation, and path safety.
- [x] CLI smoke script.
- [x] Type checking.
- [x] Build output.
- [x] README, examples, CONTRIBUTING, SECURITY, package metadata.

## Release

- [x] Push public GitHub repo to `rogerchappel/fixtureforge`.
- [x] Best-effort main branch protection.
