import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import process from 'process';
import path from 'path';

export default (extName, pathToConfig) => {
  const absolutePath = path.resolve(process.cwd(), pathToConfig);
  const data = fs.readFileSync(absolutePath).toString();
  switch (extName) {
    case '.yaml':
      return yaml.safeLoad(data);

    case '.ini':
      return ini.parse(data);

    default:
      return JSON.parse(data);
  }
};
