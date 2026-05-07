# Changelog

## 0.1.0 - 2026-05-08

### Added

- Local-first TypeScript CLI with `init`, `build`, `validate`, and `presets` commands.
- Deterministic JSON/YAML fixture specs.
- Built-in presets: `node-cli`, `polyrepo`, `messy-config`, `secret-ish`, and `broken-files`.
- Manifest generation with paths, sizes, hashes, symlink targets, and expected warnings.
- Drift validation for missing, changed, extra, and type-mismatched paths.
- Path-safety checks that reject absolute paths, traversal, empty segments, and null bytes.
- Tests, examples, smoke script, spec reference, and manifest reference.
