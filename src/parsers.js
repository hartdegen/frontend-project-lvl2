import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
  '.json': JSON.parse,
};

export default (data, fileExtension) => mapping[fileExtension](data);
