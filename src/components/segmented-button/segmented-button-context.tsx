import type { QRL, Signal } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";

export const SegmentedButtonSetContext =
  createContextId<SegmentedButtonSetContextValue>("segmented-button-set");

export type Orientation = "horizontal" | "vertical";
export type Direction = "ltr" | "rtl";

export type ItemId = string;
export type Item = {
  itemId: ItemId;
  ref: Signal<HTMLElement | undefined>;
  isSelected: Signal<boolean>;
  isDisabled: boolean;
  tabIndex: Signal<number>;
};

export type SegmentedButtonSetContextValue = {
  rootId: string;
  rootOrientation: Orientation;
  rootDirection: Direction;
  rootIsDisabled: boolean;
  rootIsLoopEnabled: boolean;
  rootMultiple: boolean;
  activateItem$: QRL<(itemValue: string) => Promise<void> | void>;
  deActivateItem$: QRL<(itemValue: string) => Promise<void> | void>;
  getAllItem$: QRL<() => Item[]>;
  selectedValuesSig: Signal<string | string[]>;
  getAndSetTabIndexItem$: QRL<(itemId: ItemId, tabIndexValue: 0 | -1) => void>;
  registerItem$: QRL<(itemId: ItemId, itemSig: Signal<Item>) => void>;
  itemsCSR: Signal<HTMLElement[]>;
};
