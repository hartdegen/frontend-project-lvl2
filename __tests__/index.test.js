import fs from 'fs';
import diff from '../src';

const path = `${__dirname}/fixtures`;

const jsonResult = `{
  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

const bigIniResult = `{
  common: {
    setting1: Value 1
  - setting2: 200
  - setting3: true
  + setting3: {
      key: value
    }
    setting6: {
      key: value
    + ops: vops
    }
  + follow: false
  + setting4: blah blah
  + setting5: {
      key5: value5
    }
  }
  group1: {
  - baz: bas
  + baz: bars
    foo: bar
  - nest: {
      key: value
    }
  + nest: str
  }
- group2: {
    abc: 12345
  }
+ group3: {
    fee: 100500
  }
}`;

const bigYamlPlainResult = `Property 'common.setting2' was deleted 
Property 'common.setting3' was changed from 'true' to '[complex value]' 
Property 'common.setting6.ops' was added with value: 'vops' 
Property 'common.follow' was added with value: 'false' 
Property 'common.setting4' was added with value: 'blah blah' 
Property 'common.setting5' was added with value: '[complex value]' 
Property 'group1.baz' was changed from 'bas' to 'bars' 
Property 'group1.nest' was changed from '[complex value]' to 'str' 
Property 'group2' was deleted 
Property 'group3' was added with value: '[complex value]' `;

test('check json diff', () => {
  expect(diff(`${path}/before.json`, `${path}/after.json`)).toBe(jsonResult);
});
test('check bigIni diff', () => {
  expect(diff(`${path}/bigBefore.ini`, `${path}/bigAfter.ini`)).toBe(bigIniResult);
});
test('check bigYaml diff in "--format plain" mode', () => {
  expect(diff(`${path}/bigBefore.yaml`, `${path}/bigAfter.yaml`, 'plain')).toBe(bigYamlPlainResult);
});
test('check JSON converter', () => {
  expect(diff(`${path}/bigBefore.json`, `${path}/bigAfter.json`, 'json'))
    .toBe(fs.readFileSync(`${path}/example.json`, 'utf-8'));
});
