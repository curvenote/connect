import type { Store } from "redux";
import { Config, HostSendContentAction, IOutputRenderFn } from "../types";
import {
  connectIFrameSendError,
  connectIFrameSendReady,
  connectIFrameSendSize,
  CONNECT_HOST_SEND_CONTENT,
} from "../actions";
import { isLocalHost } from "../utils";
import { commsDispatch } from "./comms";
import { isRenderingComplete, renderFailed } from "./slice";
import { renderStart, renderComplete } from "./slice";

export function registerIFrameListener(
  config: Config,
  store: Store,
  renderer: IOutputRenderFn
) {
  async function receiveMessage(event: MessageEvent) {
    if (event.origin !== config.origin && !isLocalHost(event.origin)) {
      return;
    }
    const action = event.data as HostSendContentAction;
    if (typeof action.type === "string" && typeof action.payload === "object") {
      switch (action.type) {
        case CONNECT_HOST_SEND_CONTENT:
          {
            const { outputs } = action.payload;
            try {
              store.dispatch(renderStart());
              renderer(document.body, outputs);
              store.dispatch(renderComplete());
              // NOTE: resize observer is responsible for sending size
            } catch (err) {
              commsDispatch(
                connectIFrameSendError(
                  window.name,
                  (err as Error).message ??
                    `Unknown error: ${JSON.stringify(err)}`
                )
              );
              store.dispatch(renderFailed());
            }
          }
          break;
        default:
          // eslint-disable-next-line no-console
          console.error(`Unknown action type: ${action.type}`);
      }
    }
  }
  window.addEventListener("message", receiveMessage);
  return () => window.removeEventListener("message", receiveMessage);
}

export function registerIFrameResizeObserver(store: Store, document: Document) {
  const SCROLLBAR_SPACING = 20;
  let resizeObserver: ResizeObserver | null = null;

  document.addEventListener("DOMContentLoaded", (event) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("OUTPUT: DOM fully loaded and parsed");
      // eslint-disable-next-line no-console
      console.log("OUTPUT: sending READY...");
    }
    resizeObserver = new window.ResizeObserver(([el]) => {
      // TODO can we use a selector here to get a better idea of the size?
      const { width, height } = el.contentRect;
      const renderReady = isRenderingComplete(store.getState());
      if (renderReady)
        commsDispatch(
          connectIFrameSendSize(
            window.name,
            width,
            Math.ceil(height) + SCROLLBAR_SPACING
          )
        );
    });
    resizeObserver.observe(document.body);
    commsDispatch(connectIFrameSendReady(window.name));
  });

  return () => resizeObserver?.disconnect();
}
