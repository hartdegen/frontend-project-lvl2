#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
// eslint-disable-next-line import/extensions
import diff from '../index-test.js';

program
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output extra debugging')
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const before = fs.readFileSync(`${firstConfig}`);
    const after = fs.readFileSync(`${secondConfig}`);
    console.log(diff(before, after));
  });

program.parse(process.argv);
