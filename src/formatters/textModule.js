const getVal = (item, count, mark) => {
  if (typeof item[0] !== 'object') return item;

  return item.reduce((acc, value) => {
    const [key, val] = Object.entries(value)[0];
    return [...acc, `{\n${mark.repeat(count + 1)}    ${key}: ${val}\n    ${mark.repeat(count)}}`];
  }, []);
};

const getRender = (arr, depthСount = 0) => arr.reduce((acc, val) => {
  const { status, key, value } = val;
  const space = '    ';

  switch (status) {
    case 'added':
      return [...acc, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(value, depthСount, space)}`];

    case 'deleted':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(value, depthСount, space)}`];

    case 'changed':
      return [...acc, `\n${space.repeat(depthСount)}  - ${key}: ${getVal(value[0], depthСount, space)}`, `\n${space.repeat(depthСount)}  + ${key}: ${getVal(value[1], depthСount, space)}`];

    case 'unchanged':
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: ${getVal(value, depthСount, space)}`];

    default:
      return [...acc, `\n${space.repeat(depthСount)}    ${key}: {`, ...getRender(value, depthСount + 1), `\n    ${space.repeat(depthСount)}}`];
  }
}, []);

export default getRender;
