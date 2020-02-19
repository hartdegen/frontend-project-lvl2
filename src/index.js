import path from 'path';
import parse from './parsers';
import formatter from './formatters/formatter';

const getFileExtension = (pathToFile) => path.extname(`${pathToFile}`);
const keysOf = (obj) => Object.keys(obj);
// b is "before"
// a is "after"
const diff = (b = {}, a = {}) => {
  const mergedConfigsArr = Object.entries({ ...b, ...a });

  return mergedConfigsArr.reduce((acc, value) => {
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

const getVal = (item, count, mark, recursionFunc) => (toString.call(item) !== '[object Object]' ? item
  : `{${recursionFunc(diff(item, item), count + 1)}\n    ${mark.repeat(count)}}`);

const getRender = (arr, depthСount = 0) => arr.reduce((acc, value) => {
  const [status, key, val, possiblyChangedVal] = value;
  const space = '    ';


  switch (status) {
    case 'added':
      return `${acc}\n${space.repeat(depthСount)}  + ${key}: ${getVal(val, depthСount, space, getRender)}`;

    case 'deleted':
      return `${acc}\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space, getRender)}`;

    case 'unchanged':
      return `${acc}\n${space.repeat(depthСount)}    ${key}: ${getVal(val, depthСount, space, getRender)}`;

    case 'changed':
      return `${acc}\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space, getRender)}\n${space.repeat(depthСount)}  + ${key}: ${getVal(possiblyChangedVal, depthСount, space, getRender)}`;

    default:
      return `${acc}\n${space.repeat(depthСount)}    ${key}: {${getRender(getVal(val, depthСount, space, getRender), depthСount + 1)}\n    ${space.repeat(depthСount)}}`;
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
      return `{${getRender(diff(bConfig, aConfig))}\n}`;
  }
};
