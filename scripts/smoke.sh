#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

rm -rf tmp/smoke
mkdir -p tmp/smoke
node dist/cli.js init tmp/smoke/fixtureforge.json
node dist/cli.js build tmp/smoke/fixtureforge.json tmp/smoke/out
node dist/cli.js validate tmp/smoke/out --manifest tmp/smoke/out/.fixtureforge-manifest.json
printf 'smoke ok\n'
