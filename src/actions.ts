import { IOutput } from "@jupyterlab/nbformat";

export const CONNECT_HOST_SEND_CONTENT = "CONNECT_HOST_SEND_CONTENT";
export const CONNECT_IFRAME_SEND_SIZE = "CONNECT_IFRAME_SEND_SIZE";
export const CONNECT_IFRAME_SEND_READY = "CONNECT_IFRAME_SEND_READY";
export const CONNECT_IFRAME_SEND_FAILED = "CONNECT_IFRAME_SEND_FAILED";

export function connectHostSendContent(id: string, outputs: IOutput[]) {
  return {
    type: CONNECT_HOST_SEND_CONTENT,
    payload: {
      id,
      outputs,
    },
  };
}

export function connectIFrameSendSize(
  id: string,
  width: number,
  height: number
) {
  return {
    type: CONNECT_IFRAME_SEND_SIZE,
    payload: {
      id,
      width,
      height,
    },
  };
}

export function connectIFrameSendReady(id: string) {
  return {
    type: CONNECT_IFRAME_SEND_READY,
    payload: {
      id,
    },
  };
}

export function connectIFrameSendError(id: string, message: string) {
  return {
    type: CONNECT_IFRAME_SEND_FAILED,
    payload: {
      id,
      message,
    },
  };
}
