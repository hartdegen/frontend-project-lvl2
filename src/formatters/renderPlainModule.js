import _ from 'lodash';

const makeVal = (arr) => {
  const verifiableItem = arr[0];
  if (_.isPlainObject(verifiableItem)) return '[complex value]';

  return _.isString(verifiableItem) ? `"${arr}"` : arr;
};

const getPlain = (arr, fullPath = '') => {
  const result = arr.map((val) => {
    const { status, key, value } = val;
    const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);

    switch (status) {
      case 'added':
        return [`Property '${pathToVerifiableKey}' was added with value: ${makeVal(value)} `];

      case 'deleted':
        return [`Property '${pathToVerifiableKey}' was deleted `];

      case 'changed':
        return [`Property '${pathToVerifiableKey}' was changed from ${makeVal(value[0])} to ${makeVal(value[1])} `];

      case 'unchanged':
        return [];

      case 'gottaCheckDeeper':
        return [getPlain(value, `${fullPath}.${key}`)];

      default:
        break;
    }

    return [];
  }, []);

  return result.flat(Infinity).join('\n');
};

export default getPlain;
