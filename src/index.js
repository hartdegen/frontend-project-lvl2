import path from 'path';
import parse from './parsers';
import getResult from './formatters/formatter';

const getFileExtension = (pathToFile) => path.extname(`${pathToFile}`);
const keysOf = (obj) => Object.keys(obj);
const makeObj = (status, key, value) => ({ status, key, value });

// b is "before"
// a is "after"
const genDiff = (b = {}, a = {}) => {
  const mergedConfigsArr = Object.entries({ ...b, ...a });

  return mergedConfigsArr.reduce((acc, value) => {
    const [key] = value;

    if (b[key] === a[key]) return [...acc, makeObj('unchanged', key, [a[key]])];

    if (typeof b[key] === 'object' && typeof a[key] === 'object') {
      return [...acc,
        makeObj('gottaCheckDeeper', key, genDiff(b[key], a[key]))];
    }

    if (keysOf(b).includes(key) && keysOf(a).includes(key)) {
      return [...acc,
        makeObj('changed', key, [[b[key]], [a[key]]])];
    }

    return !keysOf(b).includes(key)
      ? [...acc, makeObj('added', key, [a[key]])]
      : [...acc, makeObj('deleted', key, [b[key]])];
  }, []);
};

export default (before, after, format = '') => {
  const extName = (obj) => getFileExtension(obj);
  const b = parse(extName(before), before);
  const a = parse(extName(after), after);
  return format === 'json' ? JSON.stringify(b, a)
    : getResult(genDiff(b, a), format);
};
