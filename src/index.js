import path from 'path';
import parse from './parsers';
import formatter from './formatters/formatter';

const getFileExtension = (pathToFile) => path.extname(`${pathToFile}`);

const keysOf = (obj) => Object.keys(obj);
// b is "before"
// a is "after"
const diff = (b, a = {}) => {
  const mergedConfigs = Object.entries({ ...b, ...a });

  return mergedConfigs.reduce((acc, value) => {
    const [key] = value;
    if (b[key] === a[key]) return [...acc, ['unchanged', key, a[key]]];
    if (typeof b[key] === 'object' && typeof a[key] === 'object') return [...acc, ['gottaCheckDeeper', key, diff(b[key], a[key])]];
    if (keysOf(b).includes(key) && keysOf(a).includes(key)) return [...acc, ['changed', key, b[key], a[key]]];
    return (!keysOf(b).includes(key)) ? [...acc, ['added', key, a[key]]] : [...acc, ['deleted', key, b[key]]];
  }, []);
};

const getRenderResult = (arr, depthСount = 0, space = '    ') => arr.reduce((acc, value) => {
  const [status, key, val, nextVal] = value;
  const getValue = (item) => (toString.call(item) !== '[object Object]' ? item
    : `{${getRenderResult(diff(item, item), depthСount + 1)}\n    ${space.repeat(depthСount)}}`);

  if (status === 'added') return `${acc}\n${space.repeat(depthСount)}  + ${key}: ${getValue(val)}`;
  if (status === 'deleted') return `${acc}\n${space.repeat(depthСount)}  - ${key}: ${getValue(val)}`;
  if (status === 'unchanged') return `${acc}\n${space.repeat(depthСount)}    ${key}: ${getValue(val)}`;
  if (status === 'changed') return `${acc}\n${space.repeat(depthСount)}  - ${key}: ${getValue(val)}\n${space.repeat(depthСount)}  + ${key}: ${getValue(nextVal)}`;
  return `${acc}\n${space.repeat(depthСount)}    ${key}: {${getRenderResult(getValue(val), depthСount + 1)}\n    ${space.repeat(depthСount)}}`;
}, '');

export default (before, after, format = '') => {
  const extName = getFileExtension(before);
  const bConfig = parse(extName, before);
  const aConfig = parse(extName, after);
  if (format === 'plain') return formatter(bConfig, aConfig);
  if (format === 'json') return JSON.stringify(bConfig, aConfig);
  return `{${getRenderResult(diff(bConfig, aConfig))}\n}`;
};
