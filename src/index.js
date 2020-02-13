import path from 'path';
import parser from './parsers';
import formatter from './formatters/formatter';

const extensionOfFile = (pathToFile) => path.extname(`${pathToFile}`);

const render = (obj, count = 0, space = '  ') => Object.entries(obj).reduce((acc, value) => {
  const [key, val] = value;
  return typeof val !== 'object' ? `${acc}\n${space.repeat(count)}${key}: ${val}`
    : `${acc}\n${space.repeat(count)}${key}: {${render(val, count + 1)}\n${space}${space.repeat(count)}}`;
}, '');

const keysOf = (obj) => Object.keys(obj);
const valueOf = (obj) => (typeof obj !== 'object' ? obj
  : Object.entries(obj).reduce((someAcc, val) => ({ ...someAcc, [`  ${val[0]}`]: `${val[1]}` }), {}));
const diff = (b, a) => {
  const array = Object.entries({ ...b, ...a });

  return array.reduce((acc, value) => {
    const [key] = value;
    if (b[key] === a[key]) return { ...acc, [`  ${key}`]: valueOf(a[key]) };
    if (typeof b[key] === 'object' && typeof a[key] === 'object') return { ...acc, [`  ${key}`]: diff(b[key], a[key]) };
    if (keysOf(b).includes(key) && keysOf(a).includes(key)) return { ...acc, [`- ${key}`]: valueOf(b[key]), [`+ ${key}`]: valueOf(a[key]) };
    return (!keysOf(b).includes(key)) ? { ...acc, [`+ ${key}`]: valueOf(a[key]) } : { ...acc, [`- ${key}`]: valueOf(b[key]) };
  }, {});
};

export default (before, after, format = '') => {
  const extName = extensionOfFile(before);
  const b = parser(extName, before);
  const a = parser(extName, after);
  if (format === 'plain') return formatter(b, a);
  if (format === 'json') return JSON.stringify(b, a);
  return `{${render(diff(b, a))}\n}`;
};
