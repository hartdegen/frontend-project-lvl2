const keysOf = (obj) => Object.keys(obj);
const valueOf = (obj) => (toString.call(obj) === '[object Object]' ? '[complex value]' : obj);
const markIfString = (item) => (toString.call(item) === '[object String]' ? `"${item}"` : item);

const getVal = (item, count, mark) => {
  if (typeof item.value[0] !== 'object') return item.value;
  return item.value.reduce((acc, value) => {
    const [key, val] = Object.entries(value)[0];
    return [...acc, `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`];
  }, []);
};

export const getRender = (arr, depthСount = 0) => arr.reduce((acc, val) => {
  const { status, key, value } = val;
  const space = '    ';

  switch (status) {
    case 'added':
      return [...acc, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(val, depthСount, space)}`];

    case 'deleted':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(val, depthСount, space)}`];

    case 'unchanged':
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: ${getVal(val, depthСount, space)}`];

    default:
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: {`, ...getRender(value, depthСount + 1), `\n    ${space.repeat(depthСount)}}`];
  }
}, []);

export const makeFormatting = (b, a, fullPath = '') => {
  const result = Object.entries({ ...b, ...a }).reduce((acc, value) => {
    const [key] = value;
    const pathToVerifiableKey = `${fullPath}.${key}`.slice(1);
    if (b[key] === a[key]) return [...acc];

    if (typeof b[key] === 'object' && typeof a[key] === 'object' && b[key] !== a[key]) {
      return [...acc, makeFormatting(b[key], a[key], `${fullPath}.${key}`)];
    }

    if (keysOf(b).includes(key) && !keysOf(a).includes(key)) {
      return [...acc, `Property '${pathToVerifiableKey}' was deleted `];
    }

    return !keysOf(b).includes(key) && keysOf(a).includes(key) ? [...acc, `Property '${pathToVerifiableKey}' was added with value: ${markIfString(valueOf(a[key]))} `]
      : [...acc, `Property '${pathToVerifiableKey}' was changed from ${markIfString(valueOf(b[key]))} to ${markIfString(valueOf(a[key]))} `];
  }, []);
  return result.flat(Infinity).join('\n');
};
