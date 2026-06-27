#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildFixture } from './core/builder.js';
import { asErrorMessage } from './core/errors.js';
import { loadSpec, writeDefaultSpec } from './core/spec.js';
import { summarizeValidation, validateFixture } from './core/validator.js';
import { presetDescriptions, presetNames } from './presets/registry.js';
import { flagString, parseArgs } from './cli/args.js';
import { helpText } from './cli/help.js';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const args = parseArgs(argv);
  try {
    if (args.flags.version || args.command === 'version' || args.command === '--version') {
      console.log(version);
      return 0;
    }

    if (!args.command || args.command === 'help' || args.flags.help) {
      console.log(helpText);
      return 0;
    }

    if (args.command === 'init') {
      const target = args.positionals[0] ?? (args.flags.format === 'yaml' ? 'fixtureforge.yaml' : 'fixtureforge.json');
      await writeDefaultSpec(target);
      console.log(`Wrote ${target}`);
      return 0;
    }

    if (args.command === 'presets') {
      for (const name of presetNames) console.log(`${name}\t${presetDescriptions[name]}`);
      return 0;
    }

    if (args.command === 'build') {
      const [specPath, outdir] = args.positionals;
      if (!specPath || !outdir) throw new Error('build requires <spec> and <outdir>.');
      const result = await buildFixture(await loadSpec(specPath), outdir, { clean: Boolean(args.flags.clean) });
      console.log(`Built ${result.manifest.entries.length} entries at ${result.outdir}`);
      console.log(`Manifest: ${result.manifestPath}`);
      if (result.manifest.warnings.length) console.log(`Warnings: ${result.manifest.warnings.join('; ')}`);
      return 0;
    }

    if (args.command === 'validate') {
      const outdir = args.positionals[0];
      const manifest = flagString(args.flags, 'manifest');
      if (!outdir || !manifest) throw new Error('validate requires <outdir> --manifest <manifest>.');
      const result = await validateFixture(outdir, manifest);
      console.log(summarizeValidation(result));
      return result.ok ? 0 : 1;
    }

    throw new Error(`Unknown command: ${args.command}`);
  } catch (error) {
    console.error(`fixtureforge: ${asErrorMessage(error)}`);
    return 1;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
