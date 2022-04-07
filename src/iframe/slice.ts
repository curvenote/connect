import type { AnyAction } from 'redux';

/**
 * The IFrame slice deals with internal state of the iframe page.
 * The state or actions are never used in communication with the host.
 */

export interface IFrameState {
  rendering: boolean;
  complete: boolean;
  failed: boolean;
}

const CONNECT_RENDER_START = 'CONNECT_RENDER_START';
const CONNECT_RENDER_COMPLETE = 'CONNECT_RENDER_COMPLETE';
const CONNECT_RENDER_FAILED = 'CONNECT_RENDER_FAILED';

export function renderStart(): AnyAction {
  return {
    type: CONNECT_RENDER_START,
  };
}

export function renderComplete(): AnyAction {
  return {
    type: CONNECT_RENDER_COMPLETE,
  };
}

export function renderFailed(): AnyAction {
  return {
    type: CONNECT_RENDER_FAILED,
  };
}

export const isRendering = (state: IFrameState): boolean => state.rendering;
export const isRenderingComplete = (state: IFrameState): boolean => state.complete;
export const isRenderingFailed = (state: IFrameState): boolean => state.failed;

const initialState = {
  rendering: false,
  complete: false,
  failed: false,
};

export function reducer(state: IFrameState = initialState, action: AnyAction) {
  switch (action.type) {
    case CONNECT_RENDER_START: {
      if (state.rendering) return state;
      return { ...state, rendering: true, complete: false, failed: false };
    }
    case CONNECT_RENDER_COMPLETE: {
      if (state.complete) return state;
      return { ...state, complete: true, rendering: false, failed: false };
    }
    case CONNECT_RENDER_FAILED: {
      if (state.failed) return state;
      return { ...state, complete: false, rendering: false, failed: true };
    }
    default:
      return state;
  }
}
