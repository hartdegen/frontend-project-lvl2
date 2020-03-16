import getPrettyRender from './pretty';
import getPlainRender from './plain';

export default (arr, format) => {
  switch (format) {
    case 'json':
      return JSON.stringify(arr);

    case 'plain':
      return getPlainRender(arr);

    case 'pretty':
      return getPrettyRender(arr);

    default:
      throw new Error(`Warning: Unknown render mode: '${format}'!`);
  }
};
