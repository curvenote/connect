import type { Store, AnyAction } from 'redux';
import { Config, ContentRenderFn, HostSendContentAction } from '../types';
import {
  connectIFrameSendFailed,
  connectIFrameSendReady,
  connectIFrameSendSize,
  CONNECT_HOST_SEND_CONTENT,
  CONNECT_IFRAME_SEND_FAILED,
  CONNECT_IFRAME_SEND_READY,
  CONNECT_IFRAME_SEND_SIZE,
} from '../actions';
import { isLocalHost } from '../utils';
import { commsDispatch } from './comms';
import { isRenderingComplete, renderFailed } from './slice';
import { renderStart, renderComplete } from './slice';

/**
 * registerIFrameListener - registers a listener for post messages that triggers renderng on
 * receiving a CONNECT_HOST_SEND_CONTENT action.
 *
 * @param config specifies the origin at build time
 * @param store the redux store of the iframe page
 * @param renderer a function that will render content in the iframe
 * @returns
 */
export function registerIFrameListener(config: Config, store: Store, renderer: ContentRenderFn) {
  async function receiveMessage(event: MessageEvent) {
    if (event.origin !== config.origin && !isLocalHost(event.origin)) {
      return;
    }
    const action = event.data as AnyAction;
    if (typeof action.type === 'string' && typeof action.payload === 'object') {
      switch (action.type) {
        case CONNECT_HOST_SEND_CONTENT:
          {
            console.debug('received CONNECT_HOST_SEND_CONTENT action', action);
            const { content } = (action as HostSendContentAction).payload;
            try {
              store.dispatch(renderStart());
              renderer(document.body, content);
              store.dispatch(renderComplete());
              // NOTE: resize observer is responsible for sending size
            } catch (err) {
              commsDispatch(
                connectIFrameSendFailed(
                  window.name,
                  (err as Error).message ?? `Unknown error: ${JSON.stringify(err)}`,
                ),
              );
              store.dispatch(renderFailed());
            }
          }
          break;
        case CONNECT_IFRAME_SEND_FAILED:
        case CONNECT_IFRAME_SEND_READY:
        case CONNECT_IFRAME_SEND_SIZE:
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn(`Unknown action type: ${action.type}`);
      }
    }
  }
  window.addEventListener('message', receiveMessage);
  return () => window.removeEventListener('message', receiveMessage);
}

/**
 * registerIFrameResizeObserver - registers a resize observer that sends the current
 * page size to the host using a CONNECT_IFRAME_SEND_SIZE action.
 *
 * @param store - the redux store of the iframe page
 * @param document
 * @returns
 */
export function registerIFrameResizeObserver(store: Store, document: Document) {
  let resizeObserver: ResizeObserver | null = null;

  document.addEventListener('DOMContentLoaded', (event) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('curvenote/connect iframe: DOM fully loaded and parsed');
      // eslint-disable-next-line no-console
      console.debug('curvenote/connect iframe: sending READY...');
    }
    resizeObserver = new window.ResizeObserver(([el]) => {
      // TODO can we use a selector here to get a better idea of the size?
      const { height } = el.contentRect;
      const renderReady = isRenderingComplete(store.getState());
      if (renderReady) commsDispatch(connectIFrameSendSize(window.name, Math.ceil(height)));
    });
    resizeObserver.observe(document.body);
    commsDispatch(connectIFrameSendReady(window.name));
    console.debug(`curvenote/connect iframe: ready ${window.name ?? '<no window name>'}`);
  });

  return () => resizeObserver?.disconnect();
}
