import type { PropsOf } from "@builder.io/qwik";
import {
  component$,
  useContext,
  Slot,
  $,
  useId,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { isBrowser, isServer } from "@builder.io/qwik/build";
//
import type { KeyCode } from "~/utils/key-code.type";
import type { Direction, Item, Orientation } from "./segmented-button-context";
import { SegmentedButtonSetContext } from "./segmented-button-context";
import { SegmentedButton } from "./segmented-button";

type NavigationKeys =
  | KeyCode.ArrowRight
  | KeyCode.ArrowLeft
  | KeyCode.ArrowDown
  | KeyCode.ArrowUp;

type Step = -1 | 0 | 1;

const keyNavigationMap: Record<
  Orientation,
  Record<Direction, Record<NavigationKeys, Step>>
> = {
  horizontal: {
    ltr: {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 0,
      ArrowUp: 0,
    },
    rtl: {
      ArrowRight: -1,
      ArrowLeft: 1,
      ArrowDown: 0,
      ArrowUp: 0,
    },
  },
  vertical: {
    ltr: {
      ArrowDown: 1,
      ArrowUp: -1,
      ArrowRight: 0,
      ArrowLeft: 0,
    },
    rtl: {
      ArrowDown: -1,
      ArrowUp: 1,
      ArrowRight: 0,
      ArrowLeft: 0,
    },
  },
};

type SelectedButtonSetItemProps = PropsOf<typeof SegmentedButton> & {
  value: string;
};

export const SegmentedButtonSetItem = component$<SelectedButtonSetItemProps>(
  (props) => {
    const { value, disabled: itemDisabled = false, ...itemProps } = props;

    const rootApiContext = useContext(SegmentedButtonSetContext);

    const disabled = rootApiContext.rootIsDisabled || itemDisabled;

    const itemId = useId();
    const isSelectedSig = useSignal(false);
    const itemRef = useSignal<HTMLButtonElement>();
    const itemTabIndex = useSignal(isSelectedSig.value ? 0 : -1);

    const itemSig = useSignal<Item>(() => ({
      itemId: itemId,
      isSelected: isSelectedSig,
      isDisabled: disabled,
      ref: itemRef,
      tabIndex: itemTabIndex,
    }));

    useTask$(async ({ track }) => {
      const selectedValue = track(() => rootApiContext.selectedValuesSig.value);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (selectedValue == null) {
        itemSig.value.isSelected.value = false;
        return;
      }

      if (typeof selectedValue === "string") {
        itemSig.value.isSelected.value = selectedValue === value;
      } else {
        itemSig.value.isSelected.value = selectedValue.includes(value);
      }
    });

    //Item instantiation
    useTask$(async () => {
      /*
    Instantiation of items with their itemIds
    Attention: in CSR, items are registered "out of order" (itemId generation)
    you can notice:
    - the first itemId "generate" before the useTask is wrong
    - the itemId read within this useTask is not the same as the one read locally.

    Still, the order how items render is correct.

    So we doing stuff on the client (CSR, onKeyDown, etc) 
    we can't use rootApiContext.getAllItem$() as we get Items "out of order").
    Perhaps this can be fix in v2?

    Solution: if we want to get the list of items in order, we need to use "refs" directly.
    Meaning we need to use this api:  rootApiContext.itemsCSR
    */

      //Note: this line execute X times in a row. (X = number of items)
      await rootApiContext.registerItem$(itemId, itemSig);

      //setup the tabIndex for each item
      const allItems = await rootApiContext.getAllItem$();

      if (isBrowser) return;

      //ensure each selectedItems have tabIndex = 0
      const currentSelectedItems = allItems.filter(
        (item) => item.isSelected.value === true,
      );

      if (currentSelectedItems.length > 0) {
        return currentSelectedItems.forEach(async (item) => {
          await rootApiContext.getAndSetTabIndexItem$(item.itemId, 0);
        });
      }

      //ensure the first item that is not disabled have tabIndex = 0
      const firstNotDisabledItem = allItems.find(
        (item) => item.isDisabled === false,
      );

      if (firstNotDisabledItem !== undefined) {
        await rootApiContext.getAndSetTabIndexItem$(
          firstNotDisabledItem.itemId,
          0,
        );
      }
    });

    //instantiate setTabIndex for CSR
    useTask$(async ({ track }) => {
      if (isServer) return;
      track(() => itemRef.value);

      //register refs to the Root
      if (!itemRef.value) return;
      rootApiContext.itemsCSR.value = [
        ...rootApiContext.itemsCSR.value,
        itemRef.value,
      ];

      if (
        rootApiContext.itemsCSR.value.length ===
        (await rootApiContext.getAllItem$()).length
      ) {
        const allItems = rootApiContext.itemsCSR.value;

        //ensure each selectedItems have tabIndex = 0
        const currentSelectedItems = allItems.filter(
          (item) => item.ariaSelected === "true",
        );

        if (currentSelectedItems.length > 0) {
          return currentSelectedItems.forEach(async (item) => {
            const itemRef = allItems.find((i) => i.id === item.id);
            if (!itemRef) throw "Item Not Found";
            itemRef.tabIndex = 0;
          });
        }

        //ensure the first item that is not disabled have tabIndex = 0
        const firstNotDisabledItem = allItems.find(
          (item) => item.ariaDisabled === "false",
        );

        if (firstNotDisabledItem !== undefined) {
          firstNotDisabledItem.tabIndex = 0;
        }
      }
    });

    const handleSelected$ = $((selected: boolean) => {
      if (selected) {
        rootApiContext.activateItem$(value);
      } else {
        rootApiContext.deActivateItem$(value);
      }
    });

    const handleKeyDown$ = $(async (event: KeyboardEvent) => {
      //Note: here we can't use use rootApiContext.items.value as when instantiate its []
      //we might need to make a QRL same as "rootApiContext.getAllItems$()"
      const items = Array.from(
        document.querySelectorAll(
          `.segmented-button-set-item-${rootApiContext.rootId}`,
        ),
      ) as HTMLElement[];

      if (items.length === 0) return;

      const enabledItems = items.filter(
        (item) => item.ariaDisabled === "false",
      );
      //each item has an id (see below the SelectedButton JSX output)
      const currentElement = event.target as HTMLElement;
      const currentIndex = enabledItems.findIndex(
        (e) => e.id === currentElement.id,
      );

      if (currentIndex === -1) return;

      //read the direction for the key based on the orientation
      const direction =
        keyNavigationMap[rootApiContext.rootOrientation][
          rootApiContext.rootDirection
        ][event.key as NavigationKeys];

      //find and nextFocus
      if (direction !== 0) {
        let nextIndex = currentIndex + direction;
        if (rootApiContext.rootIsLoopEnabled) {
          // If looping is enabled, wrap around, skipping disabled items
          nextIndex =
            (currentIndex + direction + enabledItems.length) %
            enabledItems.length;
        } else {
          // If looping is disabled, clamp to valid indices
          if (nextIndex >= enabledItems.length)
            nextIndex = enabledItems.length - 1;
          if (nextIndex < 0) nextIndex = 0;
        }
        enabledItems[nextIndex]?.focus();
      }
    });

    return (
      <SegmentedButton
        ref={itemRef}
        {...itemProps}
        bind:selected={itemSig.value.isSelected}
        disabled={disabled}
        onSelectedChange$={handleSelected$}
        onKeyDown$={handleKeyDown$}
        class={`segmented-button-set-item-${rootApiContext.rootId} ${props.class}`}
        id={itemId}
        tabIndex={itemSig.value.tabIndex.value}
        aria-orientation={rootApiContext.rootOrientation}
        dir={rootApiContext.rootDirection}
        data-segmented-button-set-item
      >
        <Slot />
      </SegmentedButton>
    );
  },
);
