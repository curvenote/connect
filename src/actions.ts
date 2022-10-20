/**
 * These actions are used in communication between the host and the iframe.
 */

import type {
  IFrameSendFailedAction,
  HostSendContentAction,
  IFrameSendReadyAction,
  IFrameSendSizeAction,
} from './types';

export const CONNECT_HOST_SEND_CONTENT = 'CONNECT_HOST_SEND_CONTENT';
export const CONNECT_IFRAME_SEND_SIZE = 'CONNECT_IFRAME_SEND_SIZE';
export const CONNECT_IFRAME_SEND_READY = 'CONNECT_IFRAME_SEND_READY';
export const CONNECT_IFRAME_SEND_FAILED = 'CONNECT_IFRAME_SEND_FAILED';

/**
 * connectHostSendContent - action creator
 *
 * Sent by the host with any content and will trigger a render when received by the iframe
 *
 * @param id
 * @param content
 * @returns
 */
export function connectHostSendContent(id: string, content: any): HostSendContentAction {
  return {
    type: CONNECT_HOST_SEND_CONTENT,
    payload: {
      id,
      content,
    },
  };
}

/**
 * connectIFrameSendSize - action creator
 *
 * Once rendering iscomplete, and the iframe page has been resized, this action will be sent to the host
 *
 * @param id
 * @param height
 * @param width (optional)
 * @returns
 */
export function connectIFrameSendSize(
  id: string,
  height: number | null,
  width: number | null,
): IFrameSendSizeAction {
  return {
    type: CONNECT_IFRAME_SEND_SIZE,
    payload: {
      id,
      height,
      width,
    },
  };
}

/**
 * connectIFrameSendReady - action creator
 *
 * Action is sent after inital DOM load to the host to indicate that the iframe is ready to receive content
 *
 * @param id
 * @returns
 */
export function connectIFrameSendReady(id: string): IFrameSendReadyAction {
  return {
    type: CONNECT_IFRAME_SEND_READY,
    payload: {
      id,
    },
  };
}

/**
 * connectIFrameSendError - action creator
 *
 * Action is sent to the host when an error occurs during rendering
 *
 * @param id
 * @param message
 * @returns
 */
export function connectIFrameSendFailed(id: string, message: string): IFrameSendFailedAction {
  return {
    type: CONNECT_IFRAME_SEND_FAILED,
    payload: {
      id,
      message,
    },
  };
}
