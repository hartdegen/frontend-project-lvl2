import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import process from 'process';
import path from 'path';

const getAbsolutePath = (file) => path.resolve(process.cwd(), file);

const getConfig = (pathToConfig) => fs.readFileSync(getAbsolutePath(pathToConfig)).toString();

export default (extName, pathToConfig) => {
  const data = getConfig(pathToConfig);

  if (extName === '.yaml') return yaml.safeLoad(data);
  if (extName === '.ini') return ini.parse(data);
  return JSON.parse(data);
};
