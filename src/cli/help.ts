export const helpText = `fixtureforge - deterministic local-first fixture trees

Usage:
  fixtureforge init [spec.json|spec.yaml] [--format json|yaml]
  fixtureforge build <spec.json|spec.yaml> <outdir>
  fixtureforge validate <outdir> --manifest <manifest.json>
  fixtureforge presets

Examples:
  fixtureforge init fixtureforge.json
  fixtureforge build fixtureforge.json tmp/demo
  fixtureforge validate tmp/demo --manifest tmp/demo/.fixtureforge-manifest.json
`;
