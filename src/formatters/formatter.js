const keysOf = (obj) => Object.keys(obj);
const valueOf = (obj) => (toString.call(obj) === '[object Object]' ? '[complex value]' : obj);
const markIfString = (item) => (toString.call(item) === '[object String]' ? `"${item}"` : item);

const makeFormatting = (b, a, fullPath = '') => {
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

export default makeFormatting;
