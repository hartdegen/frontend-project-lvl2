import _ from 'lodash';

const getVal = (arr) => {
  const item = arr[0];
  if (_.isPlainObject(item)) return '[complex value]';
  return _.isString(item) ? `"${arr}"` : arr;
};

const getPlain = (arr, fullPath = '') => {
  const result = arr.map((val) => {
    const { status, key, value } = val;
    const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);

    switch (status) {
      case 'added':
        return [`Property '${pathToVerifiableKey}' was added with value: ${getVal(value)} `];

      case 'deleted':
        return [`Property '${pathToVerifiableKey}' was deleted `];

      case 'changed':
        return [`Property '${pathToVerifiableKey}' was changed from ${getVal(value[0])} to ${getVal(value[1])} `];

      case 'unchanged':
        return [];

      default:
        return [getPlain(value, `${fullPath}.${key}`)];
    }
  }, []);

  return result.flat(Infinity).join('\n');
};


export default getPlain;
