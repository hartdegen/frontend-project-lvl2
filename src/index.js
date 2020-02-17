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
    if (b[key] === a[key]) {
      return [...acc, ['unchanged', key, a[key]]];
    }
    if (typeof b[key] === 'object' && typeof a[key] === 'object') {
      return [...acc, ['gottaCheckDeeper', key, diff(b[key], a[key])]];
    }
    if (keysOf(b).includes(key) && keysOf(a).includes(key)) {
      return [...acc, ['changed', key, b[key], a[key]]];
    }
    return !keysOf(b).includes(key) ? [...acc, ['added', key, a[key]]]
      : [...acc, ['deleted', key, b[key]]];
  }, []);
};

const getRenderResult = (arr, depthСount = 0, space = '    ') => arr.reduce((acc, value) => {
  const [status, key, val, nextVal] = value;
  const getValue = (item) => (toString.call(item) !== '[object Object]' ? item
    : `{${getRenderResult(diff(item, item), depthСount + 1)}\n    ${space.repeat(depthСount)}}`);

  switch (status) {
    case 'added':
      return `${acc}\n${space.repeat(depthСount)}  + ${key}: ${getValue(val)}`;

    case 'deleted':
      return `${acc}\n${space.repeat(depthСount)}  - ${key}: ${getValue(val)}`;

    case 'unchanged':
      return `${acc}\n${space.repeat(depthСount)}    ${key}: ${getValue(val)}`;

    case 'changed':
      return `${acc}\n${space.repeat(depthСount)}  - ${key}: ${getValue(val)}\n${space.repeat(depthСount)}  + ${key}: ${getValue(nextVal)}`;

    default:
      return `${acc}\n${space.repeat(depthСount)}    ${key}: {${getRenderResult(getValue(val), depthСount + 1)}\n    ${space.repeat(depthСount)}}`;
  }
}, '');

export default (before, after, format = '') => {
  const extName = (obj) => getFileExtension(obj);
  const bConfig = parse(extName(before), before);
  const aConfig = parse(extName(after), after);
  switch (format) {
    case 'plain':
      return formatter(bConfig, aConfig);

    case 'json':
      return JSON.stringify(bConfig, aConfig);

    default:
      return `{${getRenderResult(diff(bConfig, aConfig))}\n}`;
  }
};
