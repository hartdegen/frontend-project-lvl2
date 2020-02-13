#!/usr/bin/env node
import program from 'commander';
// eslint-disable-next-line import/extensions
import diff from '../index.js';
// стандартный путь '..' не работает, только полное указание пути

program
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output extra debugging')
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(diff(firstConfig, secondConfig, program.format));
  });

program.parse(process.argv);
