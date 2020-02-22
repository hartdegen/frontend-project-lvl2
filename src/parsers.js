import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import process from 'process';
import path from 'path';

const getConfig = (pathToConfig) => {
  const absolutePath = path.resolve(process.cwd(), pathToConfig);
  return fs.readFileSync(absolutePath).toString();
};

export default (extName, pathToConfig) => {
  const data = getConfig(pathToConfig);
  if (extName === '.yaml') return yaml.safeLoad(data);
  if (extName === '.ini') return ini.parse(data);
  return JSON.parse(data);
};
