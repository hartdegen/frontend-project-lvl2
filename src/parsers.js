import fs from 'fs';
import process from 'process';
import yaml from 'js-yaml';
import ini from 'ini';

export default (extName, path) => {
  const fullPath = path.resolve(path, process.cwd());
  const data = fs.readFileSync(fullPath).toString();

  if (extName === '.yaml') return yaml.safeLoad(fs.readFileSync(data, 'utf-8'));
  if (extName === '.ini') return ini.parse(fs.readFileSync(data, 'utf-8'));
  return JSON.parse(fs.readFileSync(data, 'utf-8'));
};
