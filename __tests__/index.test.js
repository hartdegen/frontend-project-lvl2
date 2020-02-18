import fs from 'fs';
import path from 'path';
import diff from '../src';

const pathTo = (fileName) => path.resolve(`${__dirname}/fixtures/${fileName}`);
let resultTextFormat; let resultPlainFormat; let exampleJson;

beforeEach(() => {
  resultTextFormat = fs.readFileSync(pathTo('resultTextFormat'), 'utf-8');
  resultPlainFormat = fs.readFileSync(pathTo('resultPlainFormat'), 'utf-8');
  exampleJson = fs.readFileSync(pathTo('example.json'), 'utf-8');
});


test('check diff json', () => {
  expect(diff(pathTo('before.json'), pathTo('after.json'))).toBe(resultTextFormat);
});
test('check diff ini', () => {
  expect(diff(pathTo('before.ini'), pathTo('after.ini'))).toBe(resultTextFormat);
});
test('check diff yaml', () => {
  expect(diff(pathTo('before.yaml'), pathTo('after.yaml'))).toBe(resultTextFormat);
});
test('check diff yaml, "--format plain" mode', () => {
  expect(diff(pathTo('before.yaml'), pathTo('after.yaml'), 'plain')).toBe(resultPlainFormat);
});
test('check json converter, "--format json" mode', () => {
  expect(diff(pathTo('before.yaml'), pathTo('after.yaml'), 'json')).toBe(exampleJson);
});
