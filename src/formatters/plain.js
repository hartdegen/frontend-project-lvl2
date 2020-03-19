import _ from 'lodash';

const setValue = (item) => {
  if (_.isPlainObject(item)) return '[complex value]';

  return _.isString(item) ? `"${item}"` : item;
};

const prerender = (list, fullPath = '') => list.map((item) => {
  const {
    status, key, currentValue, oldValue,
  } = item;

  const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);

  switch (status) {
    case 'added':
      return `Property '${pathToVerifiableKey}' was added with value: ${setValue(currentValue)}`;

    case 'deleted':
      return `Property '${pathToVerifiableKey}' was deleted`;

    case 'changed':
      return `Property '${pathToVerifiableKey}' was changed from ${setValue(oldValue)} to ${setValue(currentValue)}`;

    case 'unchanged':
      return [];

    case 'nested':
      return prerender(currentValue, `${fullPath}.${key}`);

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
});

const render = (list) => prerender(list).flat(Infinity).join('\n');
export default render;
