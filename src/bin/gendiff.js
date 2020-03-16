#!/usr/bin/env node
import program from 'commander';
import diff from '..';

program
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Formats: "pretty", "plain", "json".\nCheck README for more info', 'pretty')
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(diff(firstConfig, secondConfig, program.format));
  });

program.parse(process.argv);
