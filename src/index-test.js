// trying to write diff function
export default (before, after) => {
  const b = JSON.parse(before);
  const a = JSON.parse(after);
  const array = Object.entries({ ...b, ...a });

  const reduced = array.reduce((acc, value) => {
    const [key, val] = value;
    if (a[key] === b[key]) return [...acc, `    ${[key]}: ${a[key]}`];
    if (Object.keys(b).includes(key) && val !== b[key]) return [...acc, `  + ${[key]}: ${a[key]}`, `  - ${[key]}: ${b[key]}`];
    return (!Object.keys(a).includes(key)) ? [...acc, `  - ${[key]}: ${val}`] : [...acc, `  + ${[key]}: ${val}`];
  }, []);

  return `{\n${reduced.join('\n')}\n}`;
};
