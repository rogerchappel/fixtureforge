#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null

out_dir="${TMPDIR:-/tmp}/fixtureforge-agent-docs"
rm -rf "$out_dir"
mkdir -p "$out_dir"

node dist/src/cli.js build examples/agent-docs-pack.json "$out_dir/workspace" \
  > "$out_dir/build.log"

node dist/src/cli.js validate "$out_dir/workspace" \
  --manifest "$out_dir/workspace/.fixtureforge-manifest.json" \
  > "$out_dir/validate.log"

test -f "$out_dir/workspace/README.md"
test -f "$out_dir/workspace/docs/runbooks/release.md"
test -f "$out_dir/workspace/memory/2026-06-05.md"
grep -q 'Release Runbook' "$out_dir/workspace/docs/runbooks/release.md"
grep -q 'valid' "$out_dir/validate.log"

printf 'fixture: %s/workspace\n' "$out_dir"
printf 'build log: %s/build.log\n' "$out_dir"
printf 'validate log: %s/validate.log\n' "$out_dir"
