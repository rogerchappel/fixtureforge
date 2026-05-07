# Security Policy

## Supported Versions

Security fixes target the latest released `0.x` version.

## Reporting a Vulnerability

Please report security issues privately via GitHub Security Advisories for `rogerchappel/fixtureforge` when available. If advisories are unavailable, open a minimal issue asking for a private contact path and avoid posting exploit details publicly.

## Runtime Security Model

`fixtureforge` is designed to be local-first:

- No runtime network calls.
- No package installation inside generated fixtures.
- Generated paths are required to be relative and cannot contain parent traversal, empty segments, absolute roots, or null bytes.
- Validation reads fixture trees and manifests but does not mutate the tree.

## Fake Secrets

The `secret-ish` preset intentionally creates fake credential-looking values for scanner tests. They are not real credentials and should not be used as secrets.

## Scope

Please report:

- Path traversal or output-directory escape bugs.
- Unexpected command execution.
- Runtime network calls.
- Manifest validation bypasses with security impact.

Please do not report fake values from bundled examples or presets as leaked credentials.
