import type { IOutput } from '@jupyterlab/nbformat';
import type { AnyAction } from 'redux';

export interface Config {
  origin: string;
}

export interface HostSendContentAction extends AnyAction {
  type: 'CONNECT_HOST_SEND_CONTENT';
  payload: {
    id: string;
    outputs: IOutput[];
  };
}

export interface IFrameSendSizeAction extends AnyAction {
  type: 'CONNECT_IFRAME_SEND_SIZE';
  payload: {
    id: string;
    height: number;
  };
}

export interface IFrameSendReadyAction extends AnyAction {
  type: 'CONNECT_IFRAME_SEND_READY';
  payload: {
    id: string;
  };
}

export interface IFrameSendFailedAction extends AnyAction {
  type: 'CONNECT_IFRAME_SEND_FAILED';
  payload: {
    id: string;
    message: string;
  };
}

export type IOutputRenderFn = (el: HTMLElement, outputs: IOutput[]) => void;
