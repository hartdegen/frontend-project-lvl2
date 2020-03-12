import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const pathTo = (fileName) => path.resolve(`${__dirname}/fixtures/${fileName}`);

test.each([
  ['before.json', 'after.json', 'default', 'resultTextFormat'],
  ['before.ini', 'after.ini', 'default', 'resultTextFormat'],
  ['before.yaml', 'after.yaml', 'default', 'resultTextFormat'],
  ['before.yaml', 'after.yaml', 'plain', 'resultPlainFormat'],
  ['before.yaml', 'after.yaml', 'json', 'example.json'],
])('calculate differences between 2 configs', (beforeConfig, afterConfig, format, resultFileName) => {
  const b = pathTo(beforeConfig);
  const a = pathTo(afterConfig);
  const expected = fs.readFileSync(pathTo(resultFileName), 'utf-8');
  expect(genDiff(b, a, format)).toBe(expected);
});
