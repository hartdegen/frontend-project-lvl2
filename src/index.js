// trying to write diff function
import path from 'path';
import parser from './parsers.js';


export default (before, after) => {
  const extName = path.extname(`${before}`);

  const b = parser(extName, before);
  const a = parser(extName, after);
  const array = Object.entries({ ...b, ...a });

  const reduced = array.reduce((acc, value) => {
    const [key, val] = value;
    if (a[key] === b[key]) return [...acc, `    ${[key]}: ${a[key]}`];
    if (Object.keys(b).includes(key) && val !== b[key]) return [...acc, `  + ${[key]}: ${a[key]}`, `  - ${[key]}: ${b[key]}`];
    return (!Object.keys(a).includes(key)) ? [...acc, `  - ${[key]}: ${val}`] : [...acc, `  + ${[key]}: ${val}`];
  }, []);

  return `{\n${reduced.join('\n')}\n}`;
};
