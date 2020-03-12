import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const pathTo = (fileName) => path.resolve(`${__dirname}/fixtures/${fileName}`);

test.each([
  ['before.json', 'after.json', 'pretty', 'resultTextFormat'],
  ['before.ini', 'after.ini', 'pretty', 'resultTextFormat'],
  ['before.yaml', 'after.yaml', 'pretty', 'resultTextFormat'],
  ['before.yaml', 'after.yaml', 'plain', 'resultPlainFormat'],
  ['before.yaml', 'after.yaml', 'json', 'example.json'],
])('calculate differences between 2 configs', (beforeConfig, afterConfig, format, resultFileName) => {
  const b = pathTo(beforeConfig);
  const a = pathTo(afterConfig);
  const expected = fs.readFileSync(pathTo(resultFileName), 'utf-8');
  expect(genDiff(b, a, format)).toBe(expected);
});
