import type { Signal } from "@builder.io/qwik";
import { $, useId, useSignal } from "@builder.io/qwik";
//
import { useBoundSignal } from "~/utils/bound-signal";
import type {
  SegmentedButtonSetMultipleProps,
  SegmentedButtonSetSingleProps,
  SegmentedButtonSetApiProps,
} from "./segmented-button-set.types";
import type { Item, ItemId } from "./segmented-button-context";

function useRootItemsRepo() {
  const items = useSignal<Map<ItemId, Signal<Item>>>(new Map());

  const rootId = useId();

  //only used to register itemRef in CSR land
  const itemsCSR = useSignal<HTMLElement[]>([]);

  const registerItem$ = $((itemId: ItemId, itemSig: Signal<Item>) => {
    items.value = items.value.set(itemId, itemSig);
  });

  const getAndSetTabIndexItem$ = $((itemId: ItemId, tabIndexValue: 0 | -1) => {
    const itemSig = items.value.get(itemId);
    if (!itemSig) throw "Item Not Found";
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (itemSig) {
      itemSig.value.tabIndex.value = tabIndexValue;
    }
  });

  const getAllItems$ = $(() =>
    Array.from(items.value.values()).map((signal) => signal.value),
  );

  return {
    getAllItems$,
    getAndSetTabIndexItem$,
    registerItem$,
    rootId,
    itemsCSR,
  } as const;
}

function useCreateSingleSegmentedButtonSet(
  props: SegmentedButtonSetSingleProps,
) {
  const {
    multiple = false,
    value,
    onChange$,
    "bind:value": givenValueSig,
  } = props;

  const selectedValuesSig = useBoundSignal(givenValueSig, value);
  const rootItemsRepo = useRootItemsRepo();

  const handleValueChange$ = $((newValue: string) => {
    // If trying to deselect system, keep it selected
    if (newValue === "system" && selectedValuesSig.value === "system") {
      return;
    }

    // If deselecting current value, fallback to system
    if (selectedValuesSig.value === newValue) {
      selectedValuesSig.value = "system";
    } else {
      // Normal selection
      selectedValuesSig.value = newValue;
    }

    if (onChange$) onChange$(selectedValuesSig.value);
  });

  const activateItem$ = $((itemValue: string) => handleValueChange$(itemValue));
  const deActivateItem$ = $((itemValue: string) =>
    handleValueChange$(itemValue),
  );

  return {
    multiple,
    selectedValuesSig,
    activateItem$,
    deActivateItem$,
    getAllItems$: rootItemsRepo.getAllItems$,
    getAndSetTabIndexItem$: rootItemsRepo.getAndSetTabIndexItem$,
    registerItem$: rootItemsRepo.registerItem$,
    rootId: rootItemsRepo.rootId,
    itemsCSR: rootItemsRepo.itemsCSR,
  } as const;
}

function useCreateMultipleSegmentedButtonSet(
  props: SegmentedButtonSetMultipleProps,
) {
  const {
    multiple = true,
    "bind:value": givenValueSig,
    value,
    onChange$,
  } = props;

  /*
  Need to pass an empty array if not I got: TypeError when toggle
  Uncaught (in promise) TypeError: pressedValuesSig.value is not iterable
  */
  const selectedValuesSig = useBoundSignal(givenValueSig, value || []);

  const rootItemsRepo = useRootItemsRepo();

  const handleValueChange$ = $((newValue: string[]) => {
    selectedValuesSig.value = newValue;

    if (onChange$) onChange$(selectedValuesSig.value);
  });

  const activateItem$ = $((itemValue: string) =>
    handleValueChange$([...selectedValuesSig.value, itemValue]),
  );
  const deActivateItem$ = $((itemValue: string) =>
    handleValueChange$(
      selectedValuesSig.value.filter((value) => value !== itemValue),
    ),
  );

  return {
    multiple,
    selectedValuesSig,
    activateItem$,
    deActivateItem$,
    getAllItems$: rootItemsRepo.getAllItems$,
    getAndSetTabIndexItem$: rootItemsRepo.getAndSetTabIndexItem$,
    registerItem$: rootItemsRepo.registerItem$,
    rootId: rootItemsRepo.rootId,
    itemsCSR: rootItemsRepo.itemsCSR,
  } as const;
}

function isSingleProps(
  props: SegmentedButtonSetApiProps,
): props is SegmentedButtonSetSingleProps {
  return props.multiple === undefined || props.multiple === false;
}

export function useSegmentedButtonSet(props: SegmentedButtonSetApiProps) {
  if (isSingleProps(props)) {
    // this is fine as the ToggleGroup will always be either Single or Multiple during its lifecycle
    // eslint-disable-next-line qwik/use-method-usage
    return useCreateSingleSegmentedButtonSet(props);
  }
  return useCreateMultipleSegmentedButtonSet(props);
}
