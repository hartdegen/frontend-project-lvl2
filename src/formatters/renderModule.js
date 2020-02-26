import _ from 'lodash';

const setVal = (arr, count, mark) => {
  const verifiableItem = arr[0];
  if (!_.isPlainObject(verifiableItem)) return arr;

  return arr.map((obj) => {
    const [key, val] = _.toPairs(obj)[0];
    return `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`;
  }, []);
};

const startRender = (arr, depthСount = 0) => arr.map((val) => {
  const { status, key, value } = val;
  const space = '    ';
  const [oldValue, newValue] = value; // this is only for case 'changed'


  switch (status) {
    case 'added':
      return [`\n${space.repeat(depthСount)}  + ${key}: ${setVal(value, depthСount, space)}`];

    case 'deleted':
      return [`\n${space.repeat(depthСount)}  - ${key}: ${setVal(value, depthСount, space)}`];

    case 'changed':
      return [`\n${space.repeat(depthСount)}  - ${key}: ${setVal(oldValue, depthСount, space)}`, `\n${space.repeat(depthСount)}  + ${key}: ${setVal(newValue, depthСount, space)}`];

    case 'unchanged':
      return [`\n${space.repeat(depthСount)}    ${key}: ${setVal(value, depthСount, space)}`];

    case 'gottaCheckDeeper':
      return [`\n${space.repeat(depthСount)}    ${key}: {`, startRender(value, depthСount + 1), `\n    ${space.repeat(depthСount)}}`];

    default:
      break;
  }

  return [];
}, []);

const getRenderResult = (obj) => `{${startRender(obj).flat(Infinity).join('')}\n}`;

export default getRenderResult;
