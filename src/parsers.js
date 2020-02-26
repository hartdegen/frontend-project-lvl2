import yaml from 'js-yaml';
import ini from 'ini';

export default (extName, config) => {
  if (extName === '.yaml') return yaml.safeLoad(config);
  if (extName === '.ini') return ini.parse(config);
  return JSON.parse(config);
};
