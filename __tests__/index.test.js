import fs from 'fs';
import path from 'path';
import diff from '../src';

const pathToFile = (fileName) => path.resolve(`${__dirname}/fixtures/${fileName}`);

const beforeJson = pathToFile('before.json');
const afterJson = pathToFile('after.json');
const resultJson = fs.readFileSync(pathToFile('resultJson'), 'utf-8');

const bigBeforeIni = pathToFile('bigBefore.ini');
const bigAfterIni = pathToFile('bigAfter.ini');
const resultBigIni = fs.readFileSync(pathToFile('resultBigIni'), 'utf-8');

const bigBeforeYaml = pathToFile('bigBefore.yaml');
const bigAfterYaml = pathToFile('bigAfter.yaml');
const resultBigYamlPlain = fs.readFileSync(pathToFile('resultBigYamlPlain'), 'utf-8');

const bigBeforeJson = pathToFile('bigBefore.json');
const bigAfterJson = pathToFile('bigAfter.json');
const exampleJson = fs.readFileSync(pathToFile('example.json'), 'utf-8');


test('check json diff', () => {
  expect(diff(beforeJson, afterJson)).toBe(resultJson);
});
test('check bigIni diff', () => {
  expect(diff(bigBeforeIni, bigAfterIni)).toBe(resultBigIni);
});
test('check bigYaml diff in "--format plain" mode', () => {
  expect(diff(bigBeforeYaml, bigAfterYaml, 'plain')).toBe(resultBigYamlPlain);
});
test('check JSON converter', () => {
  expect(diff(bigBeforeJson, bigAfterJson, 'json')).toBe(exampleJson);
});
