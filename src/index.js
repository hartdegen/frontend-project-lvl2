import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getResult from './formatters/index';

const makeObj = (status, key, oneOrMoreValues) => ({ status, key, oneOrMoreValues });

// b is config "before"
// a is config "after"
const genDiff = (b, a) => {
  const keys = _.union(_.keys(b), _.keys(a));

  return _.isEmpty(keys) ? keys
    : keys.map((key) => {
      if (_.isEqual(b[key], a[key])) {
        return makeObj('unchanged', key, [a[key]]);
      }

      if (_.isPlainObject(b[key]) && _.isPlainObject(a[key])) {
        return makeObj('gottaCheckDeeper', key, genDiff(b[key], a[key]));
      }

      if (_.has(b, key) && _.has(a, key)) {
        return makeObj('changed', key, [[b[key]], [a[key]]]);
      }

      return !_.has(b, key)
        ? makeObj('added', key, [a[key]])
        : makeObj('deleted', key, [b[key]]);
    });
};

const getFileExtension = (fileName) => path.extname(`${fileName}`);
const getAbsolutePath = (fileName) => path.resolve(process.cwd(), fileName);
const getData = (pathToConfig) => fs.readFileSync(getAbsolutePath(pathToConfig), 'utf8');

export default (configBefore, configAfter, format = '') => {
  const dataBefore = parse(getData(configBefore), getFileExtension(configBefore));
  const dataAfter = parse(getData(configAfter), getFileExtension(configAfter));
  const comparedData = genDiff(dataBefore, dataAfter);

  return getResult(comparedData, format);
};
