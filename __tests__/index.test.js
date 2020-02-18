import fs from 'fs';
import path from 'path';
import diff from '../src';

const pathToFile = (fileName) => path.resolve(`${__dirname}/fixtures/${fileName}`);

const beforeJson = pathToFile('before.json');
const afterJson = pathToFile('after.json');
const resultJsonFormat = fs.readFileSync(pathToFile('resultJsonFormat'), 'utf-8');

const beforeIni = pathToFile('before.ini');
const afterIni = pathToFile('after.ini');
const resultIniFormat = fs.readFileSync(pathToFile('resultIniFormat'), 'utf-8');

const beforeYaml = pathToFile('before.yaml');
const afterYaml = pathToFile('after.yaml');
const resultPlainYamlFormat = fs.readFileSync(pathToFile('resultPlainYamlFormat'), 'utf-8');

const exampleJson = fs.readFileSync(pathToFile('example.json'), 'utf-8');


test('check json diff', () => {
  expect(diff(beforeIni, afterIni)).toBe(resultJsonFormat);
});
test('check ini diff', () => {
  expect(diff(beforeIni, afterIni)).toBe(resultIniFormat);
});
test('check yaml diff, "--format plain" mode', () => {
  expect(diff(beforeYaml, afterYaml, 'plain')).toBe(resultPlainYamlFormat);
});
test('check json converter, "--format json" mode', () => {
  expect(diff(beforeJson, afterJson, 'json')).toBe(exampleJson);
});
