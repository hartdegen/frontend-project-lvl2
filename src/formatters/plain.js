import _ from 'lodash';

const setVal = (item) => {
  if (_.isPlainObject(item)) return '[complex value]';

  return _.isString(item) ? `"${item}"` : item;
};

const prerender = (arr, fullPath = '') => arr.map((item) => {
  const {
    status, key, currentValue, oldValue,
  } = item;

  const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);

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
      return prerender(currentValue, `${fullPath}.${key}`);

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
});

const render = (arr) => prerender(arr).flat(Infinity).join('\n');
export default render;
