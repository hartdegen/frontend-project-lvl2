import path from 'path';
import parse from './parsers';
import formatter from './formatters/formatter';

const getFileExtension = (pathToFile) => path.extname(`${pathToFile}`);

const startRendering = (obj, depthСount = 0, space = '  ') => Object.entries(obj).reduce((acc, value) => {
  const [key, val] = value;
  return typeof val !== 'object' ? `${acc}\n${space.repeat(depthСount)}${key}: ${val}`
    : `${acc}\n${space.repeat(depthСount)}${key}: {${startRendering(val, depthСount + 1)}\n${space}${space.repeat(depthСount)}}`;
}, '');

const keysOf = (obj) => Object.keys(obj);
const valueOf = (obj) => (typeof obj !== 'object' ? obj
  : Object.entries(obj).reduce((someAcc, val) => ({ ...someAcc, [`  ${val[0]}`]: `${val[1]}` }), {}));

// b is "before"
// a is "after"
const diff = (b, a) => {
  const mergedConfigs = Object.entries({ ...b, ...a });

  return mergedConfigs.reduce((acc, value) => {
    const [key] = value;
    if (b[key] === a[key]) return { ...acc, [`  ${key}`]: valueOf(a[key]) };
    if (typeof b[key] === 'object' && typeof a[key] === 'object') return { ...acc, [`  ${key}`]: diff(b[key], a[key]) };
    if (keysOf(b).includes(key) && keysOf(a).includes(key)) return { ...acc, [`- ${key}`]: valueOf(b[key]), [`+ ${key}`]: valueOf(a[key]) };
    return (!keysOf(b).includes(key)) ? { ...acc, [`+ ${key}`]: valueOf(a[key]) } : { ...acc, [`- ${key}`]: valueOf(b[key]) };
  }, {});
};

export default (before, after, format = '') => {
  const extName = getFileExtension(before);
  const bConfig = parse(extName, before);
  const aConfig = parse(extName, after);
  if (format === 'plain') return formatter(bConfig, aConfig);
  if (format === 'json') return JSON.stringify(bConfig, aConfig);
  return `{${startRendering(diff(bConfig, aConfig))}\n}`;
};
