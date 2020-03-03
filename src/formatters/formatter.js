import getRender from './renderModule';
import getRenderPlain from './renderPlainModule';

export default (arr, format) => {
  if (format === 'json') return JSON.stringify(arr);
  if (format === 'plain') return getRenderPlain(arr);
  return getRender(arr);
};
