import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import process from 'process';
import path from 'path';

export default (extName, somePath) => {
  const fullPath = path.resolve(process.cwd(), somePath);
  const data = fs.readFileSync(fullPath).toString();
  switch (extName) {
    case '.yaml':
      return yaml.safeLoad(data);

    case '.ini':
      return ini.parse(data);

    default:
      return JSON.parse(data);
  }
};
