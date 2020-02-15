import fs from 'fs';
import path from 'path';
import diff from '../src';

const pathToTestsDir = path.resolve(`${__dirname}/fixtures`);
const resultJson = fs.readFileSync(path.resolve(`${pathToTestsDir}/resultJson`), 'utf-8');
const resultBigIni = fs.readFileSync(path.resolve(`${pathToTestsDir}/resultBigIni`), 'utf-8');
const resultBigYamlPlain = fs.readFileSync(path.resolve(`${pathToTestsDir}/resultBigYamlPlain`), 'utf-8');
const exampleJson = fs.readFileSync(path.resolve(`${pathToTestsDir}/example.json`), 'utf-8');



test('check json diff', () => {
  expect(diff(`${pathToTestsDir}/before.json`, `${pathToTestsDir}/after.json`)).toBe(resultJson);
});
test('check bigIni diff', () => {
  expect(diff(`${pathToTestsDir}/bigBefore.ini`, `${pathToTestsDir}/bigAfter.ini`)).toBe(resultBigIni);
});
test('check bigYaml diff in "--format plain" mode', () => {
  expect(diff(`${pathToTestsDir}/bigBefore.yaml`, `${pathToTestsDir}/bigAfter.yaml`, 'plain'))
    .toBe(resultBigYamlPlain);
});
test('check JSON converter', () => {
  expect(diff(`${pathToTestsDir}/bigBefore.json`, `${pathToTestsDir}/bigAfter.json`, 'json'))
    .toBe(exampleJson);
});
