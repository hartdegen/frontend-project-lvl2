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
      return [...acc, { status: 'unchanged', key: `${key}`, value: [a[key]] }];
    }
    if (typeof b[key] === 'object' && typeof a[key] === 'object') {
      return [...acc, { status: 'gottaCheckDeeper', key: `${key}`, value: genDiff(b[key], a[key]) }];
    }
    if (keysOf(b).includes(key) && keysOf(a).includes(key)) {
      return [...acc,
        { status: 'changedOld', key: `${key}`, value: [b[key]] },
        { status: 'changedNew', key: `${key}`, value: [a[key]] }];
    }
    return !keysOf(b).includes(key)
      ? [...acc, { status: 'added', key: `${key}`, value: [a[key]] }]
      : [...acc, { status: 'deleted', key: `${key}`, value: [b[key]] }];
  }, []);
};

const getVal = (item, count, mark, recursionFunc) => {
  if (typeof item.value[0] !== 'object') return item.value;
  return `{${recursionFunc(genDiff(item.value[0], item.value[0]), count + 1)}\n    ${mark.repeat(count)}}`;
};

const getRender = (arr, depthСount = 0) => arr.reduce((acc, val) => {
  const { status, key, value } = val;
  const space = '    ';

  switch (status) {
    case 'added':
      return [...acc, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'deleted':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'unchanged':
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'changedOld':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space, getRender)}`];

    case 'changedNew':
      return [...acc, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(val, depthСount, space, getRender)}`];

    default:
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: {`, ...getRender(value, depthСount + 1), `\n    ${space.repeat(depthСount)}}`];
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
