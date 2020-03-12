import _ from 'lodash';

const setVal = (item, count, mark) => {
  if (!_.isPlainObject(item)) return item;
  const pairs = _.toPairs(item);

  return pairs.map((keyAndValue) => {
    const [key, val] = keyAndValue;
    return `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`;
  });
};

const runRender = (arr, depthСount = 0) => arr.map((val) => {
  const { status, key, values } = val;
  const space = '    ';
  const { oldValue, newValue } = values; // this is only for case 'changed'
  const { value } = values; // and this for all others

  switch (status) {
    case 'added':
      return `${space.repeat(depthСount)}  + ${key}: ${setVal(value, depthСount, space)}`;

    case 'deleted':
      return `${space.repeat(depthСount)}  - ${key}: ${setVal(value, depthСount, space)}`;

    case 'changed':
      return `${space.repeat(depthСount)}  - ${key}: ${setVal(oldValue, depthСount, space)}\n${space.repeat(depthСount)}  + ${key}: ${setVal(newValue, depthСount, space)}`;

    case 'unchanged':
      return `${space.repeat(depthСount)}    ${key}: ${setVal(value, depthСount, space)}`;

    case 'nested':
      return [`${space.repeat(depthСount)}    ${key}: {`, runRender(values, depthСount + 1), `    ${space.repeat(depthСount)}}`];

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
}, []);

const getResult = (obj) => `{\n${runRender(obj).flat(Infinity).join('\n')}\n}`;

export default getResult;
