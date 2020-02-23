import _ from 'lodash';

const getVal = (arr, count, mark) => {
  const item = arr[0];
  if (!_.isPlainObject(item)) return arr;

  return arr.map((obj) => {
    const [key, val] = Object.entries(obj)[0];
    return `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`;
  }, []);
};

const startRender = (arr, depthСount = 0) => arr.map((val) => {
  const { status, key, value } = val;
  const space = '    ';

  switch (status) {
    case 'added':
      return [`\n${space.repeat(depthСount)}  + ${key}: ${getVal(value, depthСount, space)}`];

    case 'deleted':
      return [`\n${space.repeat(depthСount)}  - ${key}: ${getVal(value, depthСount, space)}`];

    case 'changed':
      return [`\n${space.repeat(depthСount)}  - ${key}: ${getVal(value[0], depthСount, space)}`, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(value[1], depthСount, space)}`];

    case 'unchanged':
      return [`\n${space.repeat(depthСount)}    ${key}: ${getVal(value, depthСount, space)}`];

    default:
      return [`\n${space.repeat(depthСount)}    ${key}: {`, startRender(value, depthСount + 1), `\n    ${space.repeat(depthСount)}}`];
  }
}, []);

const getRender = (obj) => `{${startRender(obj).flat(Infinity).join('')}\n}`;

export default getRender;
