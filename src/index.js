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
  return diff(b, a).replace(/"/g, '');
};

const diff = (b = {}, a = {}) => {
  const array = Object.entries({ ...b, ...a });
  console.log('ARRAY', array);

  const reduced = array.reduce((acc, value) => {
    console.log('VALUE', value);

    const [key, val] = value;
    console.log('B-KEY', b[key], 'A-KEY', a[key]);

    if (b[key] === a[key]) return [...acc, `    ${[key]}: ${a[key]}`];
    if (!Object.keys(a).includes(key)) return [...acc, `  - ${[key]}: ${JSON.stringify(val)}`];
    if (!Object.keys(b).includes(key) && Object.keys(a).includes(key)) return [...acc, `  + ${[key]}: ${JSON.stringify(val)}`];

    if (typeof b[key] === 'object' && typeof a[key] === 'object') return [...acc, `    ${[key]}: ${diff(b[key], a[key])}`];
    
    console.log('OBJECT KEYS B', Object.keys(b), 'KEY', key, 'VAL', val, 'B-KEY', b[key]);
    if (Object.keys(b).includes(key) && val !== b[key]) return [...acc, `  - ${[key]}: ${JSON.stringify(b[key])}`, `  + ${[key]}: ${JSON.stringify(a[key])}`];
    return [...acc, `    ${[key]}: ${a[key]}`];
  }, []);

  return `{\n${reduced.join('\n')}\n}`;
};

export default parserFunc;
