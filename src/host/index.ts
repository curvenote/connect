import { commsDispatch } from './comms';
import { registerHostListener } from './setup';
import { reducer, selectors } from './slice';

export { HostState, HostStateItem } from './slice';

export default {
  commsDispatch,
  registerMessageListener: registerHostListener,
  reducer,
  selectors,
};
