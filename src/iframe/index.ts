import { commsDispatch } from './comms';
import { registerIFrameListener, registerIFrameResizeObserver } from './setup';
import {
  isRendering,
  isRenderingComplete,
  isRenderingFailed,
  reducer,
  renderComplete,
  renderFailed,
  renderStart,
} from './slice';

export default {
  commsDispatch,
  reducer,
  actions: {
    renderStart,
    renderComplete,
    renderFailed,
  },
  selectors: {
    isRendering,
    isRenderingComplete,
    isRenderingFailed,
  },
  registerMessageListener: registerIFrameListener,
  registerResizeObserver: registerIFrameResizeObserver,
};
