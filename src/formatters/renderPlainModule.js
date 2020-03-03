import _ from 'lodash';

const setVal = (arr) => {
  const verifiableItem = arr[0];
  if (_.isPlainObject(verifiableItem)) return '[complex value]';

  return _.isString(verifiableItem) ? `"${arr}"` : arr;
};

const getPlain = (arr, fullPath = '') => {
  const result = arr.map((val) => {
    const { status, key, oneOrMoreValues } = val;
    const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);
    const [oldValue, newValue] = oneOrMoreValues; // this is only for case 'changed'

    switch (status) {
      case 'added':
        return [`Property '${pathToVerifiableKey}' was added with value: ${setVal(oneOrMoreValues)} `];

      case 'deleted':
        return [`Property '${pathToVerifiableKey}' was deleted `];

      case 'changed':
        return [`Property '${pathToVerifiableKey}' was changed from ${setVal(oldValue)} to ${setVal(newValue)} `];

      case 'unchanged':
        return [];

      case 'gottaCheckDeeper':
        return [getPlain(oneOrMoreValues, `${fullPath}.${key}`)];

      default:
        throw new Error(`Warning: Unknown render case: '${status}'!`);
    }
  }, []);

  return result.flat(Infinity).join('\n');
};

export default getPlain;
