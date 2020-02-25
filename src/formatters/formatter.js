import getRender from './renderModule';
import getRenderPlain from './renderPlainModule';

export default (arr, format) => (format === 'plain' ? getRenderPlain(arr) : getRender(arr));
