import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getResult from './formatters';

const makeObj = (status, key, currentValue, oldValue = null) => ({
  status, key, currentValue, oldValue,
});

const genDiff = (configBefore, configAfter) => {
  const keys = _.union(_.keys(configBefore), _.keys(configAfter));
  if (_.isEmpty(keys)) return [];

  return keys.map((key) => {
    if (!_.has(configBefore, key)) return makeObj('added', key, configAfter[key]);
    if (!_.has(configAfter, key)) return makeObj('deleted', key, configBefore[key]);

    if (_.isPlainObject(configBefore[key]) && _.isPlainObject(configAfter[key])) {
      return makeObj('nested', key, genDiff(configBefore[key], configAfter[key]));
    }

    if (_.isEqual(configBefore[key], configAfter[key])) {
      return makeObj('unchanged', key, configAfter[key]);
    }
    return makeObj('changed', key, configAfter[key], configBefore[key]);
  });
};

const getType = (fileName) => path.extname(fileName).slice(1);
const getPath = (fileName) => path.resolve(process.cwd(), fileName);
const getData = (pathToConfig) => fs.readFileSync(getPath(pathToConfig), 'utf8');

export default (configBefore, configAfter, format) => {
  const dataBefore = parse(getData(configBefore), getType(configBefore));
  const dataAfter = parse(getData(configAfter), getType(configAfter));
  const comparedData = genDiff(dataBefore, dataAfter);

  return getResult(comparedData, format);
};
