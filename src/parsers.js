import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import process from 'process';
import path from 'path';

const getConfigFile = (pathToConfig) => {
  const absolutePath = path.resolve(process.cwd(), pathToConfig);
  return fs.readFileSync(absolutePath).toString();
};

export default (extName, pathToConfig) => {
  const data = getConfigFile(pathToConfig);
  switch (extName) {
    case '.yaml':
      return yaml.safeLoad(data);

    case '.ini':
      return ini.parse(data);

    default:
      return JSON.parse(data);
  }
};
