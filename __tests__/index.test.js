import fs from 'fs';
import path from 'path';
import diff from '../src';

const pathTo = (fileName) => path.resolve(`${__dirname}/fixtures/${fileName}`);

test.each([
  ['before.json', 'after.json', '', 'resultTextFormat'],
  ['before.ini', 'after.ini', '', 'resultTextFormat'],
  ['before.yaml', 'after.yaml', '', 'resultTextFormat'],
  ['before.yaml', 'after.yaml', 'plain', 'resultPlainFormat'],
  ['before.yaml', 'after.yaml', 'json', 'example.json'],
])('calculate differences between 2 configs', (before, after, format, resultFileName) => {
  const b = pathTo(before);
  const a = pathTo(after);
  const expected = fs.readFileSync(pathTo(resultFileName), 'utf-8');
  expect(diff(b, a, format)).toBe(expected);
});
