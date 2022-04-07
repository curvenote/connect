import {
  CONNECT_IFRAME_SEND_FAILED,
  CONNECT_IFRAME_SEND_READY,
  CONNECT_IFRAME_SEND_SIZE,
} from '../actions';
import type { AnyAction } from 'redux';

/*
    A redux slice for use in the host page.
*/

export interface IFrameState {
  ready: boolean;
  height: number | null;
  width: number | null;
  error: boolean;
  message?: string;
}

export interface HostState {
  [id: string]: IFrameState;
}

export function reducer(state: HostState = {}, action: AnyAction) {
  switch (action.type) {
    case CONNECT_IFRAME_SEND_READY: {
      const { id } = action.payload;
      if (state[id] && state[id].ready) return state;
      return {
        ...state,
        [id]: {
          ready: true,
          height: null,
          width: null,
          error: false,
        },
      };
    }
    case CONNECT_IFRAME_SEND_SIZE: {
      const { id, width, height } = action.payload;
      if (state[id] && state[id].width === width && state[id].height === height) return state;
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
  selectIFrameReady: (state: HostState, id: string) => state[id] && state[id].ready,
  selectIFrameSize: (state: HostState, id: string) => {
    if (!state[id]) return { width: null, height: null };
    const { width, height } = state[id];
    return { width, height };
  },
  selectIFrameFailed: (state: HostState, id: string) =>
    state[id] && state[id].error && { message: state[id].message },
};
