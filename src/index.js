import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import getResult from './formatters/formatter';

const makeObj = (status, key, value) => ({ status, key, value });

// b is "before"
// a is "after"
const genDiff = (b, a) => {
  const keys = Object.keys({ ...b, ...a });

  return keys.map((key) => {
    if (_.isEqual(b[key], a[key])) {
      return makeObj('unchanged', key, [a[key]]);
    }

    if (_.isPlainObject(b[key]) && _.isPlainObject(a[key])) {
      return makeObj('gottaCheckDeeper', key, genDiff(b[key], a[key]));
    }

    if (_.has(b, key) && _.has(a, key)) {
      return makeObj('changed', key, [[b[key]], [a[key]]]);
    }

    return !_.has(b, key)
      ? makeObj('added', key, [a[key]])
      : makeObj('deleted', key, [b[key]]);
  });
};

export default (before, after, format = '') => {
  const getFileExtension = (file) => path.extname(`${file}`);

  const b = parse(getFileExtension(before), before);
  const a = parse(getFileExtension(after), after);

  return format === 'json' ? JSON.stringify(b, a)
    : getResult(genDiff(b, a), format);
};
