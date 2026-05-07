# Fixture Spec Reference

A fixture spec is a JSON file or simple YAML file with these fields.

## Top-Level Fields

- `name` string: manifest display name.
- `seed` string or number: deterministic content seed.
- `presets` array: any of `node-cli`, `polyrepo`, `messy-config`, `secret-ish`, `broken-files`.
- `directories` array: relative directory paths to create.
- `files` array: file entries.
- `symlinks` array: symlink entries.
- `warnings` array: expected warnings copied into the manifest.

## File Entries

Each file requires `path` and may provide one content source:

- `content`: exact UTF-8 text.
- `json`: stable-key-order JSON value.
- `lines`: number of deterministic generated lines.
- `bytes`: approximate deterministic text length, or exact binary length when `binary` is true.
- `binary`: write deterministic bytes.
- `executable`: chmod file to `755` on platforms that support it.

## Path Safety

All generated paths must be relative and may not contain absolute roots, parent traversal (`..`), empty path segments, current-directory segments (`.`), or null bytes.
