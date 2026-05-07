# fixtureforge OSS Factory Orchestration

## Build Order

1. Product docs: keep `docs/PRD.md`, add task tracker, and add machine-readable orchestration metadata.
2. Package foundation: TypeScript config, CLI bin entry, source/test layout, and npm scripts.
3. Spec model: schema types, default spec creation, JSON/YAML loading, and validation.
4. Generation engine: deterministic seeded content, path safety, file operations, and manifest writing.
5. Presets: implement V1 preset fixtures as composable spec fragments.
6. Validation: compare generated tree with manifest hashes and report drift.
7. CLI UX: `init`, `build`, `validate`, `presets`, help, errors, and exit codes.
8. Documentation/examples: copy-paste README flows and reusable examples.
9. Verification: tests, typecheck, build, smoke, and `scripts/validate.sh`.
10. Release: create public GitHub repo, push `main`, set metadata, protect branch best-effort.

## Constraints

- Local-first only: no network calls from the package runtime.
- Deterministic by default: same spec and seed produce the same tree and manifest.
- Path safety: generated paths must remain inside the chosen output directory.
- Human-readable specs: JSON and a conservative YAML subset are supported.
- Manifest validation is explicit and does not mutate the fixture tree.

## Commit Strategy

Use small, meaningful commits grouped by docs, package setup, implementation slices, tests, docs/examples, verification helpers, and release metadata. Avoid no-op commits.
