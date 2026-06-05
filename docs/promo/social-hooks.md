# Social Hook Pack

Use these as draft prompts for human-edited posts. They are grounded in the README, `examples/agent-docs-pack.json`, and `docs/tutorials/build-agent-doc-fixture.md`.

## Short Posts

- Public demos should not need private repos. `fixtureforge` builds deterministic synthetic file trees from small JSON or YAML specs.
- The agent-docs fixture creates Markdown docs, memory notes, JSON config, generated text, and messy config files for local scanner demos.
- Commit the spec, generate the tree, then validate the manifest when you need to catch fixture drift.

## Demo CTA

Try the local demo:

```sh
npm run build
node dist/src/cli.js build examples/agent-docs-pack.json tmp/agent-docs-pack
node dist/src/cli.js validate tmp/agent-docs-pack --manifest tmp/agent-docs-pack/.fixtureforge-manifest.json
```

## Guardrails

- Say "synthetic fixture content" instead of "anonymized production data."
- Do not imply the presets cover every edge case.
- Keep the focus on deterministic local test fixtures.
