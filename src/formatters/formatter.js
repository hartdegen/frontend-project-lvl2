const keysOf = (obj) => Object.keys(obj);
const valueOf = (obj) => (typeof obj !== 'object' ? obj : '[complex value]');
const func = (b, a, name = '', keyName = '') => {
  const result = Object.entries({ ...b, ...a }).reduce((acc, value) => {
    const [key] = value;
    const way = `${keyName}.${key}`.slice(1);
    if (typeof b[key] === 'object' && typeof a[key] === 'object' && b[key] !== a[key]) return [...acc, func(b[key], a[key], name, `${keyName}.${key}`)];
    if (b[key] === a[key]) return [...acc];
    if (keysOf(b).includes(key) && !keysOf(a).includes(key)) return [...acc, `Property '${way}' was deleted `];
    return !keysOf(b).includes(key) && keysOf(a).includes(key) ? [...acc, `Property '${way}' was added with value: '${valueOf(a[key])}' `]
      : [...acc, `Property '${way}' was changed from '${valueOf(b[key])}' to '${valueOf(a[key])}' `];
  }, []);
  return result.flat(Infinity).join('\n');
};

export default func;
