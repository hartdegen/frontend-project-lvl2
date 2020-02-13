import fs from 'fs';
import yaml from 'js-yaml';
import gendiff from '../src';

const beforeJson = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/before.json`));
const afterJson = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/after.json`));

const beforeYaml = yaml.safeLoad(fs.readFileSync(`${__dirname}/fixtures/before.yaml`));
const afterYaml = yaml.safeLoad(fs.readFileSync(`${__dirname}/fixtures/after.yaml`));

const answer = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

test('check json diff', () => {
  expect(gendiff(beforeJson, afterJson)).toBe(answer);
});
test('check yaml diff', () => {
  expect(gendiff(beforeYaml, afterYaml)).toEqual(answer);
});
