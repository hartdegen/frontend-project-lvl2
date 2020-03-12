import _ from 'lodash';

const setVal = (item) => {
  if (_.isPlainObject(item)) return '[complex value]';

  return _.isString(item) ? `"${item}"` : item;
};

const runPlainRender = (arr, fullPath = '') => arr.map((val) => {
  const { status, key, values } = val;
  const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);
  const { oldValue, newValue } = values; // this is only for case 'changed'
  const { value } = values; //              and this for all others

  switch (status) {
    case 'added':
      return `Property '${pathToVerifiableKey}' was added with value: ${setVal(value)} `;

    case 'deleted':
      return `Property '${pathToVerifiableKey}' was deleted `;

    case 'changed':
      return `Property '${pathToVerifiableKey}' was changed from ${setVal(oldValue)} to ${setVal(newValue)} `;

    case 'unchanged':
      return [];

    case 'nested':
      return runPlainRender(values, `${fullPath}.${key}`);

    default:
      throw new Error(`Warning: Unknown render case: '${status}'!`);
  }
}, []);

const getResult = (arr, fullPath) => runPlainRender(arr, fullPath).flat(Infinity).join('\n');

export default getResult;
