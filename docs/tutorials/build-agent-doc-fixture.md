# Build An Agent Docs Fixture

Use this recipe when you need a repeatable file tree for testing local doc search, runbook packing, or agent handoff tooling.

The example spec at `examples/agent-docs-pack.json` creates a tiny workspace with Markdown docs, a memory note, JSON config, generated log text, and the `messy-config` preset.

## Run It Locally

```sh
npm install
npm run build
rm -rf tmp/agent-docs-pack
node dist/src/cli.js build examples/agent-docs-pack.json tmp/agent-docs-pack
node dist/src/cli.js validate tmp/agent-docs-pack --manifest tmp/agent-docs-pack/.fixtureforge-manifest.json
```

The output directory is deterministic for the same spec and seed. Commit the spec, not the generated `tmp/` directory, unless your downstream test suite needs checked-in fixtures.

## Use The Generated Tree

The generated fixture is useful for tools that need realistic local files without reaching into a private repository:

```sh
find tmp/agent-docs-pack -maxdepth 2 -type f | sort
```

Expected paths include:

- `README.md`
- `docs/runbooks/release.md`
- `memory/2026-06-05.md`
- `configs/service.json`
- `logs/sample-output.txt`

## Why This Is Safer Than Copying A Real Workspace

`fixtureforge` rejects unsafe output paths and keeps all generated files local. The example content is synthetic, so it can be used in public demos without leaking private runbooks, credentials, or customer-specific data.
