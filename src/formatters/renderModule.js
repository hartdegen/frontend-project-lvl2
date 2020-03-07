import _ from 'lodash';

const setVal = (item, count, mark) => {
  if (!_.isPlainObject(item)) return item;
  const pairs = _.toPairs(item);

  return pairs.map((keyAndValue) => {
    const [key, val] = keyAndValue;
    return `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`;
  });
};

const prepareDataToRender = (arr, depthСount = 0) => arr.map((val) => {
  const { status, key, children } = val;
  const space = '    ';
  const { oldValue, newValue } = children; // this is only for case 'changed'

  switch (status) {
    case 'added':
      return `${space.repeat(depthСount)}  + ${key}: ${setVal(children, depthСount, space)}`;

    case 'deleted':
      return `${space.repeat(depthСount)}  - ${key}: ${setVal(children, depthСount, space)}`;

    case 'changed':
      return `${space.repeat(depthСount)}  - ${key}: ${setVal(oldValue, depthСount, space)}\n${space.repeat(depthСount)}  + ${key}: ${setVal(newValue, depthСount, space)}`;

    case 'unchanged':
      return `${space.repeat(depthСount)}    ${key}: ${setVal(children, depthСount, space)}`;

    case 'gottaCheckDeeper':
      return [`${space.repeat(depthСount)}    ${key}: {`, prepareDataToRender(children, depthСount + 1), `    ${space.repeat(depthСount)}}`];

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
}, []);

const runRender = (obj) => `{\n${prepareDataToRender(obj).flat(Infinity).join('\n')}\n}`;

export default runRender;
