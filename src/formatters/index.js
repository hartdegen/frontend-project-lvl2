import getRender from './renderModule';
import getRenderPlain from './renderPlainModule';

export default (arr, format) => {
  switch (format) {
    case 'json':
      return JSON.stringify(arr);

    case 'plain':
      return getRenderPlain(arr);

    case '':
      return getRender(arr);

    default:
      throw new Error(`Warning: Unknown render mode: '${format}'!`);
  }
};
