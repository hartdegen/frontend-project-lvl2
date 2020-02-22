import _ from 'lodash';

const valueOf = (item) => {
  if (_.isPlainObject(...item)) return '[complex value]';
  return _.isString(...item) ? `"${item}"` : item;
};

const getPlain = (arr, fullPath = '') => arr.reduce((acc, val) => {
  const { status, key, value } = val;
  const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);

  switch (status) {
    case 'added':
      return [...acc, `Property '${pathToVerifiableKey}' was added with value: ${valueOf(value)} `];

    case 'deleted':
      return [...acc, `Property '${pathToVerifiableKey}' was deleted `];

    case 'changed':
      return [...acc, `Property '${pathToVerifiableKey}' was changed from ${valueOf(value[0])} to ${valueOf(value[1])} `];

    case 'unchanged':
      return [...acc];

    default:
      return [...acc, getPlain(value, `${fullPath}.${key}`)];
  }
}, []);


export default getPlain;
