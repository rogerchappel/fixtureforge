# Manifest Format

`fixtureforge build` writes `.fixtureforge-manifest.json` into the output directory.

```json
{
  "version": 1,
  "name": "fixture",
  "seed": "fixtureforge",
  "generatedAt": "1970-01-01T00:00:00.000Z",
  "entries": [],
  "warnings": []
}
```

## Design Notes

- `generatedAt` is intentionally fixed so manifests are deterministic and snapshot-friendly.
- Entries are sorted by path.
- File entries include byte size and SHA-256 hash.
- Directory entries include observed directory size for basic drift visibility.
- Symlink entries include the link target.
- Warnings are sorted and deduplicated.

## Validation

`fixtureforge validate <outdir> --manifest <manifest>` checks every manifest entry and reports missing, changed, extra, or type-mismatched paths. Validation is read-only.
