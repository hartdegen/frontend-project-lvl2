import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getResult from './formatters';

const makeObj = (status, key, children) => ({ status, key, children });

// b is config "before"
// a is config "after"
const genDiff = (b, a) => {
  const keys = _.union(_.keys(b), _.keys(a));
  if (_.isEmpty(keys)) throw new Error('Warning: The program cannot be executed. Please check arguments for compliance with the requirements');

  return keys.map((key) => {
    if (!_.has(b, key)) return makeObj('added', key, [a[key]]);
    if (!_.has(a, key)) return makeObj('deleted', key, [b[key]]);

    if (_.isPlainObject(b[key]) && _.isPlainObject(a[key])) {
      return makeObj('gottaCheckDeeper', key, genDiff(b[key], a[key]));
    }

    if (_.isEqual(b[key], a[key])) {
      return makeObj('unchanged', key, [a[key]]);
    }
    return makeObj('changed', key, [[b[key]], [a[key]]]);
  });
};

const getFileExtension = (fileName) => path.extname(fileName);
const getAbsolutePath = (fileName) => path.resolve(process.cwd(), fileName);
const getData = (pathToConfig) => fs.readFileSync(getAbsolutePath(pathToConfig), 'utf8');

export default (configBefore, configAfter, format = 'render') => {
  const dataBefore = parse(getData(configBefore), getFileExtension(configBefore));
  const dataAfter = parse(getData(configAfter), getFileExtension(configAfter));
  const comparedData = genDiff(dataBefore, dataAfter);

  return getResult(comparedData, format);
};
