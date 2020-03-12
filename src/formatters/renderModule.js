import _ from 'lodash';

const setVal = (item, count, mark) => {
  if (!_.isPlainObject(item)) return item;
  const pairs = _.toPairs(item);

  return pairs.map((keyAndValue) => {
    const [key, val] = keyAndValue;
    return `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`;
  });
};

const runRender = (arr, depth = 0) => arr.map((item) => {
  const { status, key, values } = item;

  const space = '    ';
  const { oldValue, currentValue } = values;

  switch (status) {
    case 'added':
      return `${space.repeat(depth)}  + ${key}: ${setVal(currentValue, depth, space)}`;

    case 'deleted':
      return `${space.repeat(depth)}  - ${key}: ${setVal(currentValue, depth, space)}`;

    case 'unchanged':
      return `${space.repeat(depth)}    ${key}: ${setVal(currentValue, depth, space)}`;

    case 'changed':
      return `${space.repeat(depth)}  - ${key}: ${setVal(oldValue, depth, space)}\n${space.repeat(depth)}  + ${key}: ${setVal(currentValue, depth, space)}`;

    case 'nested':
      return [`${space.repeat(depth)}    ${key}: {`, runRender(values, depth + 1), `${space.repeat(depth + 1)}}`];

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
});
const getResult = (obj) => `{\n${runRender(obj).flat(Infinity).join('\n')}\n}`;

export default getResult;
