import type { AnyAction } from 'redux';

export function commsDispatch(targetFrame: HTMLIFrameElement | null, action: AnyAction) {
  targetFrame?.contentWindow?.postMessage(action, '*');
}
