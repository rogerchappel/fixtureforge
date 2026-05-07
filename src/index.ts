export { buildFixture, expandSpec } from './core/builder.js';
export { loadSpec, validateSpec, writeDefaultSpec, defaultSpec } from './core/spec.js';
export { validateFixture, summarizeValidation } from './core/validator.js';
export { presetDescriptions, presetNames, getPreset } from './presets/registry.js';
export type { BuildResult, FileSpec, FixtureManifest, FixtureSpec, ManifestEntry, PresetName, ValidationIssue, ValidationResult } from './types.js';
