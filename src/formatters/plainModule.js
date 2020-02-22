const valueOf = (obj) => (toString.call(...obj) === '[object Object]' ? '[complex value]' : obj);
const markIfString = (item) => (toString.call(...item) === '[object String]' ? `"${item}"` : item);

const getPlain = (arr, fullPath = '') => {
  const result = arr.reduce((acc, val) => {
    const { status, key, value } = val;
    const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);

    switch (status) {
      case 'added':
        return [...acc, `Property '${pathToVerifiableKey}' was added with value: ${markIfString(valueOf(value))} `];

      case 'deleted':
        return [...acc, `Property '${pathToVerifiableKey}' was deleted `];

      case 'changed':
        return [...acc, `Property '${pathToVerifiableKey}' was changed from ${markIfString(valueOf(value[0]))} to ${markIfString(valueOf(value[1]))} `];

      case 'unchanged':
        return [...acc];

      default:
        return [...acc, getPlain(value, `${fullPath}.${key}`)];
    }
  }, []);
  return result.flat(Infinity).join('\n');
};

export default getPlain;
