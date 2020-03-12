import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getResult from './formatters';

const makeObj = (status, key, values) => ({ status, key, values });

// b is config "before"
// a is config "after"
const genDiff = (b, a) => {
  const keys = _.union(_.keys(b), _.keys(a));
  if (_.isEmpty(keys)) return console.log('Both arguments are empty, the program cannot be executed');

  return keys.map((key) => {
    if (!_.has(b, key)) return makeObj('added', key, { value: a[key] });
    if (!_.has(a, key)) return makeObj('deleted', key, { value: b[key] });

    if (_.isPlainObject(b[key]) && _.isPlainObject(a[key])) {
      return makeObj('nested', key, genDiff(b[key], a[key]));
    }

    if (_.isEqual(b[key], a[key])) {
      return makeObj('unchanged', key, { value: a[key] });
    }
    return makeObj('changed', key, { oldValue: b[key], newValue: a[key] });
  });
};

const getFileType = (fileName) => path.extname(fileName).slice(1);
const getAbsolutePath = (fileName) => path.resolve(process.cwd(), fileName);
const getData = (pathToConfig) => fs.readFileSync(getAbsolutePath(pathToConfig), 'utf8');

export default (configBefore, configAfter, format = 'common') => {
  const dataBefore = parse(getData(configBefore), getFileType(configBefore));
  const dataAfter = parse(getData(configAfter), getFileType(configAfter));
  const comparedData = genDiff(dataBefore, dataAfter);

  return getResult(comparedData, format);
};
