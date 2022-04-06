import type { Store, AnyAction } from "redux";
import {
  CONNECT_IFRAME_SEND_FAILED,
  CONNECT_IFRAME_SEND_READY,
  CONNECT_IFRAME_SEND_SIZE,
} from "../actions";
import { IFrameSendFailedAction, IFrameSendSizeAction } from "../types";
import {
  ReceiveIFrameFailedFn,
  ReceiveIFrameReadyFn,
  ReceiveIFrameSizeFn,
} from "./types";

export function registerHostListener(
  store: Store,
  handlers: {
    ready: ReceiveIFrameReadyFn;
    size: ReceiveIFrameSizeFn;
    failed: ReceiveIFrameFailedFn;
  }
) {
  function receiveMessage(event: MessageEvent) {
    const action = event.data as AnyAction;
    const iframe = document.getElementsByName(
      action.payload?.id
    )[0] as HTMLIFrameElement;
    if (
      !action.payload ||
      iframe == null ||
      !(event.origin === "null" && event.source === iframe.contentWindow)
    ) {
      return;
    }
    if (typeof action.payload === "object") {
      switch (action.type) {
        case CONNECT_IFRAME_SEND_READY: {
          const { id } = (action as IFrameSendSizeAction).payload;
          handlers.ready(store, { id });
          break;
        }
        case CONNECT_IFRAME_SEND_SIZE: {
          const { id, width, height } = (action as IFrameSendSizeAction)
            .payload;
          handlers.size(store, { id, width, height });
          break;
        }
        case CONNECT_IFRAME_SEND_FAILED: {
          const { id, message } = (action as IFrameSendFailedAction).payload;
          handlers.failed(store, { id, message });
          break;
        }
        default:
          console.error(`Unknown action type: ${action.type}`);
      }
    }
  }
  window.addEventListener("message", receiveMessage);
  return () => window.removeEventListener("message", receiveMessage);
}
