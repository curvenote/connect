import { IOutput } from '@jupyterlab/nbformat';

/**
 * These actions are used in communication between the host and the iframe.
 */

export const CONNECT_HOST_SEND_CONTENT = 'CONNECT_HOST_SEND_CONTENT';
export const CONNECT_IFRAME_SEND_SIZE = 'CONNECT_IFRAME_SEND_SIZE';
export const CONNECT_IFRAME_SEND_READY = 'CONNECT_IFRAME_SEND_READY';
export const CONNECT_IFRAME_SEND_FAILED = 'CONNECT_IFRAME_SEND_FAILED';

/**
 * connectHostSendContent - action creator
 *
 * Sent by the host with IOutput[] content and will trigger a render when received by the iframe
 *
 * @param id
 * @param outputs
 * @returns
 */
export function connectHostSendContent(id: string, outputs: IOutput[]) {
  return {
    type: CONNECT_HOST_SEND_CONTENT,
    payload: {
      id,
      outputs,
    },
  };
}

/**
 * connectIFrameSendSize - action creator
 *
 * Once rendering iscomplete, and the iframe page has been resized, this action will be sent to the host
 *
 * @param id
 * @param width
 * @param height
 * @returns
 */
export function connectIFrameSendSize(id: string, width: number, height: number) {
  return {
    type: CONNECT_IFRAME_SEND_SIZE,
    payload: {
      id,
      width,
      height,
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
export function connectIFrameSendReady(id: string) {
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
export function connectIFrameSendFailed(id: string, message: string) {
  return {
    type: CONNECT_IFRAME_SEND_FAILED,
    payload: {
      id,
      message,
    },
  };
}
