import {
  CONNECT_IFRAME_SEND_FAILED,
  CONNECT_IFRAME_SEND_READY,
  CONNECT_IFRAME_SEND_SIZE,
} from '../actions';
import type { AnyAction } from 'redux';

/*
    A redux slice for use in the host page.
*/
export interface HostStateItem {
  ready: boolean;
  error: boolean;
  width: number | null;
  height: number | null;
  message?: string;
}

export interface HostState {
  [id: string]: HostStateItem;
}

export function reducer(state: HostState = {}, action: AnyAction) {
  switch (action.type) {
    case CONNECT_IFRAME_SEND_READY: {
      const { id } = action.payload;
      if (state[id] && state[id].ready) return state;
      return {
        ...state,
        [id]: {
          ...state[id],
          ready: true,
          error: false,
          width: null,
          height: null,
        },
      };
    }
    case CONNECT_IFRAME_SEND_SIZE: {
      const { id, width, height } = action.payload;
      if (state[id] && state[id].height === height && state[id].width === width) return state;
      return {
        ...state,
        [id]: {
          ...state[id],
          height,
          width,
        },
      };
    }
    case CONNECT_IFRAME_SEND_FAILED: {
      const { id, message } = action.payload;
      if (state[id] && state[id].error) return state;
      return {
        ...state,
        [id]: {
          ...state[id],
          error: true,
          message,
        },
      };
    }
    default:
      return state;
  }
}

export const selectors = {
  selectIFrameReady: (state: HostState, id: string): Boolean => state[id] && state[id].ready,
  selectIFrame: (state: HostState, id: string): HostStateItem | undefined => state[id],
  selectIFrameSize: (
    state: HostState,
    id: string,
  ): Pick<HostStateItem, 'width' | 'height'> | undefined =>
    state[id] && {
      width: state[id].width,
      height: state[id].height,
    },
  selectIFrameFailed: (state: HostState, id: string) =>
    state[id] && state[id].error && { message: state[id].message },
};
