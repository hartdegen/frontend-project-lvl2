import _ from 'lodash';

const setVal = (item) => {
  if (_.isPlainObject(item)) return '[complex value]';

  return _.isString(item) ? `"${item}"` : item;
};

const runPlainRender = (arr, fullPath = '') => arr.map((item) => {
  const { status, key, values } = item;

  const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);
  const { oldValue, currentValue } = values;

  switch (status) {
    case 'added':
      return `Property '${pathToVerifiableKey}' was added with value: ${setVal(currentValue)}`;

    case 'deleted':
      return `Property '${pathToVerifiableKey}' was deleted`;

    case 'changed':
      return `Property '${pathToVerifiableKey}' was changed from ${setVal(oldValue)} to ${setVal(currentValue)}`;

    case 'unchanged':
      return [];

    case 'nested':
      return runPlainRender(values, `${fullPath}.${key}`);

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
});

const getResult = (arr, fullPath) => runPlainRender(arr, fullPath).flat(Infinity).join('\n');
export default getResult;
