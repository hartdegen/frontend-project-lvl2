import fs from 'fs';
import gendiff from '../src';

const before = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/before.json`));
const after = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/after.json`));

const answer = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

test('check json diff', () => {
  expect(gendiff(before, after)).toBe(answer);
});
