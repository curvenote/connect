import type { AnyAction } from "redux";

export const commsDispatch = (action: AnyAction) => {
  // eslint-disable-next-line no-restricted-globals
  parent.postMessage(action, "*");
};
