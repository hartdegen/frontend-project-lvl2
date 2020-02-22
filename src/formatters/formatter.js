import getRender from './textModule';
import getPlain from './plainModule';

export default (arr, format) => (format === 'plain' ? getPlain(arr).flat(Infinity).join('\n')
  : `{${getRender(arr).join('')}\n}`);
