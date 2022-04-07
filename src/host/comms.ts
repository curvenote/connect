import type { AnyAction } from 'redux';

/**
 * commsDispatch - postMessage wrapper for use in the host page
 *
 * @param targetFrame
 * @param action
 */
export function commsDispatch(targetFrame: HTMLIFrameElement | null, action: AnyAction) {
  targetFrame?.contentWindow?.postMessage(action, '*');
}
