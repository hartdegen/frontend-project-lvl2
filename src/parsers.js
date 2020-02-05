import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

// Get document, or throw exception on error
// try {
//  const doc = yaml.safeLoad(fs.readFileSync('bin/fixtures/after.yaml'));
//  console.log(doc);
// } catch (e) {
//  console.log(e);
// }

export default (extName, path) => {
  if (extName === '.json') return JSON.parse(fs.readFileSync(`${path}`, 'utf-8'));
  if (extName === '.yaml') return yaml.safeLoad(fs.readFileSync(`${path}`, 'utf-8'));
  if (extName === '.ini') return ini.parse(fs.readFileSync(`${path}`, 'utf-8'));
};
