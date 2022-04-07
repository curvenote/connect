import type { AnyAction } from 'redux';

/**
 * commsDispatch - postMessage wrapper for use in the iframe
 *
 * @param action
 */
export const commsDispatch = (action: AnyAction) => {
  // eslint-disable-next-line no-restricted-globals
  parent.postMessage(action, '*');
};
