import type { Store, AnyAction } from 'redux';
import {
  CONNECT_IFRAME_SEND_FAILED,
  CONNECT_IFRAME_SEND_READY,
  CONNECT_IFRAME_SEND_SIZE,
} from '../actions';

/**
 * registerHostListener - register a listener for the host page
 *
 * On receiving post message from one of potentially many iframes, this function will dispatch
 * the same action to the host store.
 *
 * @param store the host page redux store, this is passed to the handler functions
 * @returns
 */
export function registerHostListener(store: Store) {
  function receiveMessage(event: MessageEvent) {
    const action = event.data as AnyAction;
    const iframe = document.getElementsByName(action.payload?.id)[0] as HTMLIFrameElement;
    console.debug(`host received ${action.type} action`, action);
    if (
      !action.payload ||
      iframe == null ||
      !(event.origin === 'null' && event.source === iframe.contentWindow)
    ) {
      return;
    }
    if (typeof action.payload === 'object') {
      switch (action.type) {
        case CONNECT_IFRAME_SEND_SIZE:
          console.debug(
            `host received { width: ${action.payload.width}, height: ${action.payload.height} })`,
            action,
          );
        case CONNECT_IFRAME_SEND_READY:
        case CONNECT_IFRAME_SEND_FAILED:
          store.dispatch(action);
          break;
        default:
          console.error(`Unknown action type: ${action.type}`);
      }
    }
  }
  window.addEventListener('message', receiveMessage);
  return () => window.removeEventListener('message', receiveMessage);
}
