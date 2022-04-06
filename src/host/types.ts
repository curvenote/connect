import type { Store } from "redux";

export type ReceiveIFrameReadyFn = (
  store: Store,
  props: { id: string }
) => void;

export interface IFrameSizeProps {
  id: string;
  width: number;
  height: number;
}

export type ReceiveIFrameSizeFn = (
  store: Store,
  props: IFrameSizeProps
) => void;

export type ReceiveIFrameFailedFn = (
  store: Store,
  props: { id: string; message: string }
) => void;
