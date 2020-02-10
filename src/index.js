/* eslint-disable no-trailing-spaces */
/* eslint-disable no-empty */
// trying to write diff function
import path from 'path';
import parser from './parsers.js';

const extensionOfFile = (pathToFile) => path.extname(`${pathToFile}`);

const parserFunc = (before, after) => {
  const extName = extensionOfFile(before);
  const b = parser(extName, before);
  const a = parser(extName, after);
  // eslint-disable-next-line no-use-before-define
  return `{${render(diff(b, a))}\n}`;
};

const render = (obj, count = 0, space = '   ') => {
  const array = Object.entries(obj);
  return array.reduce((acc, val) => {
    if (typeof val[1] !== 'object') return `${acc}\n ${space.repeat(count)}${val[0]}: ${val[1]}`;
    if (typeof val[1] === 'object' && count === 0) return `${acc}\n  ${val[0]}: {${render(val[1], count + 1)}\n${space} }`;
    if (typeof val[1] === 'object') return `${acc}\n${space} ${val[0]}: {${render(val[1], count + 1)}\n${space.repeat(2)}}`;
  }, '');
};

const diff = (b = {}, a = {}) => {
  const sliced = { ...b, ...a };
  const array = Object.entries(sliced);
  console.log('ARRAY', array);

  const reduced = array.reduce((acc, value) => {
    if (typeof value === 'string') return value;
    const [key] = value;
    
    if (b[key] === a[key]) return { ...acc, [`  ${key}`]: a[key] };
    if (typeof b[key] === 'object' && typeof a[key] === 'object') return { ...acc, [`  ${key}`]: diff(b[key], a[key]) };
    if (Object.keys(b).includes(key) && !Object.keys(a).includes(key)) return { ...acc, [`- ${key}`]: b[key] };
    if (!Object.keys(b).includes(key) && Object.keys(a).includes(key)) return { ...acc, [`+ ${key}`]: a[key] };
    if (Object.keys(b).includes(key) && Object.keys(a).includes(key) && typeof b[key] !== 'object') return { ...acc, [`- ${key}`]: b[key], [`+ ${key}`]: a[key] };
    if (Object.keys(b).includes(key) && Object.keys(a).includes(key) && typeof a[key] !== 'object') return { ...acc, [`- ${key}`]: b[key], [`+ ${key}`]: a[key] };
    return { ...acc };
  }, {});
  return reduced;
};

export default parserFunc;
