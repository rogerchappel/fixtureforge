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
bash demo/run-agent-docs-fixture.sh
```

The demo writes a synthetic docs workspace under `/tmp/fixtureforge-agent-docs/workspace` and verifies the generated manifest.

## Launch Note Draft

`fixtureforge` helps CLI maintainers build deterministic file-tree fixtures without copying private repositories into tests or demos. Specs can be JSON or YAML, presets cover common repo shapes, and each generated tree includes a manifest that can be validated later for drift.

The agent-docs demo uses `examples/agent-docs-pack.json` to create Markdown docs, a runbook, a memory note, JSON config, generated text, and intentionally messy config files. It is a public-safe fixture for demos of doc scanners, agent handoff tools, and local file-tree workflows.

## Guardrails

- Say "synthetic fixture content" instead of "anonymized production data."
- Do not imply the presets cover every edge case.
- Keep the focus on deterministic local test fixtures.
