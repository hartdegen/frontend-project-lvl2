const before = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};
const after = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

const diff = (b, a) => {
  const array = Object.entries({ ...b, ...a });
  const reduced = array.reduce((acc, value) => {
    const [key, val] = value;
    if (a[key] === b[key]) return [...acc, `    ${[key]}: ${a[key]}`];
    if (Object.keys(b).includes(key) && val !== b[key]) return [...acc, `  + ${[key]}: ${a[key]}`, `  - ${[key]}: ${b[key]}`];
    return (!Object.keys(a).includes(key)) ? [...acc, `  - ${[key]}: ${val}`] : [...acc, `  + ${[key]}: ${val}`];
  }, []);
  return `{\n${reduced.join('\n')}\n}`;
};

console.log(diff(before, after));
