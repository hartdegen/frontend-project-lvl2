import path from 'path';
import parse from './parsers';
import formatter from './formatters/formatter';

const getFileExtension = (pathToFile) => path.extname(`${pathToFile}`);
const keysOf = (obj) => Object.keys(obj);
// b is "before"
// a is "after"
const genDiff = (b = {}, a = {}) => {
  const mergedConfigsArr = Object.entries({ ...b, ...a });

  return mergedConfigsArr.reduce((acc, value) => {
    const [key] = value;

    if (b[key] === a[key]) {
      return [...acc, ['unchanged', key, a[key]]];
    }
    if (typeof b[key] === 'object' && typeof a[key] === 'object') {
      return [...acc, ['gottaCheckDeeper', key, genDiff(b[key], a[key])]];
    }
    if (keysOf(b).includes(key) && keysOf(a).includes(key)) {
      return [...acc, ['changed', key, b[key], a[key]]];
    }
    return !keysOf(b).includes(key) ? [...acc, ['added', key, a[key]]]
      : [...acc, ['deleted', key, b[key]]];
  }, []);
};

const getVal = (item, count, mark, recursionFunc) => (toString.call(item) !== '[object Object]' ? `${item}`
  : `{${recursionFunc(genDiff(item, item), count + 1).flat(Infinity)}\n    ${mark.repeat(count)}}`);

const getRender = (arr, depthСount = 0) => arr.reduce((acc, value) => {
  const [status, key, val, possiblyChangedVal] = value;
  const space = '    ';

  switch (status) {
    case 'added':
      return [...acc, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'deleted':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'unchanged':
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'changed':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space, getRender)}\n${space.repeat(depthСount)}  + ${key}: ${getVal(possiblyChangedVal, depthСount, space, getRender)}`];

    default:
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: {`, ...getRender(val, depthСount + 1), `\n    ${space.repeat(depthСount)}}`];
  }
}, []);

const makeFormatting = (before, after, format) => {
  switch (format) {
    case 'plain':
      return formatter(before, after);

    case 'json':
      return JSON.stringify(before, after);

    default:
      return `{${getRender(genDiff(before, after)).join('')}\n}`;
  }
};

export default (before, after, format = '') => {
  const extName = (obj) => getFileExtension(obj);
  const bConfig = parse(extName(before), before);
  const aConfig = parse(extName(after), after);
  return makeFormatting(bConfig, aConfig, format);
};
