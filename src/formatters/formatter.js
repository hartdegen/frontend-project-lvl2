const keysOf = (obj) => Object.keys(obj);
const valueOf = (obj) => (typeof obj !== 'object' ? obj : '[complex value]');
const markForText = (item) => (typeof item === 'string' ? `"${item}"` : item);

const makeFormatting = (b, a, name = '', keyName = '') => {
  const result = Object.entries({ ...b, ...a }).reduce((acc, value) => {
    const [key] = value;
    const pathToVerifiableKey = `${keyName}.${key}`.slice(1);
    if (typeof b[key] === 'object' && typeof a[key] === 'object' && b[key] !== a[key]) return [...acc, makeFormatting(b[key], a[key], name, `${keyName}.${key}`)];
    if (b[key] === a[key]) return [...acc];
    if (keysOf(b).includes(key) && !keysOf(a).includes(key)) return [...acc, `Property '${pathToVerifiableKey}' was deleted `];
    return !keysOf(b).includes(key) && keysOf(a).includes(key) ? [...acc, `Property '${pathToVerifiableKey}' was added with value: ${markForText(valueOf(a[key]))} `]
      : [...acc, `Property '${pathToVerifiableKey}' was changed from ${markForText(valueOf(b[key]))} to ${markForText(valueOf(a[key]))} `];
  }, []);
  return result.flat(Infinity).join('\n');
};

export default makeFormatting;
