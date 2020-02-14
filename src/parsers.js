import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import process from 'process';
import path from 'path';

export default (extName, somePath) => {
  const fullPath = path.resolve(process.cwd(), somePath);
  const data = fs.readFileSync(fullPath).toString();

  if (extName === '.yaml') return yaml.safeLoad(data);
  if (extName === '.ini') return ini.parse(data);
  return JSON.parse(data);
};
