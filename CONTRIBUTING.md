# Contributing

Thanks for helping improve `fixtureforge`.

## Local Setup

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
```

## Project Guidelines

- Keep fixture output deterministic.
- Keep runtime local-first; do not add network calls to generation or validation.
- Treat path safety as a core feature.
- Add or update tests for every behavior change.
- Prefer small focused pull requests.

## Commit Style

Use concise conventional-style commits when practical, for example:

- `feat: add preset option`
- `fix: reject unsafe symlink path`
- `docs: clarify manifest validation`

## Adding Presets

1. Add the preset to `PresetName` in `src/types.ts`.
2. Add description and implementation in `src/presets/registry.ts`.
3. Add tests that build the preset and validate deterministic output.
4. Document the preset in `README.md`.

## Reporting Issues

Please include:

- Node.js version
- `fixtureforge` version or commit SHA
- Spec file (with secrets removed)
- Expected vs actual behavior
