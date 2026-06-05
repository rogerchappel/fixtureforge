# Video Brief: Build A Fake Repo For CLI Tests

## Angle

Show how `fixtureforge` creates deterministic local file trees so CLI tests and demos do not need private repositories or hand-made throwaway fixtures.

## Grounded Demo Assets

- Agent docs spec: `examples/agent-docs-pack.json`
- Node CLI spec: `examples/node-cli.json`
- Security scanner spec: `examples/security-scan.yaml`
- Spec reference: `docs/SPEC.md`
- Manifest reference: `docs/MANIFEST.md`

## 60-Second Flow

1. Run `node dist/src/cli.js presets` to show the built-in fixture shapes.
2. Open `examples/agent-docs-pack.json` and point out the seed, directories, files, and `messy-config` preset.
3. Build the fixture into `tmp/agent-docs-pack`.
4. Run `validate` with the generated `.fixtureforge-manifest.json`.
5. Change one generated file and rerun `validate` to show drift detection.

## Claims To Avoid

- Do not claim production data anonymization. The demo uses synthetic content.
- Do not claim network or hosted service behavior. The README describes a local-first tool.
- Do not imply every scanner case is covered by the presets; the presets are small starter shapes.

## Short Hooks

- "Stop copying real repos into tests. Generate the weird little tree you need."
- "Deterministic fixtures for CLI tests, with a manifest you can validate."
- "A fake repo that is safe enough for public demos and useful enough for drift checks."
