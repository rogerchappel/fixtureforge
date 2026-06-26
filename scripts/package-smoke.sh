#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$repo_root"
npm run build >/dev/null
npm pack --dry-run >/dev/null
npm pack --pack-destination "$tmp" >/dev/null

package_tgz="$(find "$tmp" -maxdepth 1 -name 'fixtureforge-*.tgz' -print -quit)"
test -n "$package_tgz"

mkdir -p "$tmp/app"
cd "$tmp/app"
npm init -y >/dev/null
npm install "$package_tgz" >/dev/null

./node_modules/.bin/fixtureforge >/dev/null
presets_output="$(./node_modules/.bin/fixtureforge presets)"
grep -q 'node-cli' <<<"$presets_output"
./node_modules/.bin/fixtureforge build node_modules/fixtureforge/examples/node-cli.json "$tmp/generated"
./node_modules/.bin/fixtureforge validate "$tmp/generated" --manifest "$tmp/generated/.fixtureforge-manifest.json"
test -s node_modules/fixtureforge/examples/agent-docs-pack.json

echo 'fixtureforge package smoke passed'
