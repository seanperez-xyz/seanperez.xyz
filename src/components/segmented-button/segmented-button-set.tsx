import type { PropsOf } from "@builder.io/qwik";
import {
  $,
  component$,
  Slot,
  useContextProvider,
  useTask$,
} from "@builder.io/qwik";
//
import { cn } from "~/utils";
import type { SegmentedButtonSetApiProps } from "./segmented-button-set.types";
import type { SegmentedButtonSetContextValue } from "./segmented-button-context";
import { SegmentedButtonSetContext } from "./segmented-button-context";
import { useSegmentedButtonSet } from "./use-segmented-button-set";
import { isBrowser, isServer } from "@builder.io/qwik/build";
import { segmentedButtonSetVariants } from "./variants";
import type { VariantProps } from "class-variance-authority";

export type SegmentedButtonSetRootProps = PropsOf<"div"> &
  SegmentedButtonSetApiProps &
  VariantProps<typeof segmentedButtonSetVariants>;

export const SegmentedButtonSet = component$<SegmentedButtonSetRootProps>(
  (props) => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange$: _,
      disabled = false,
      orientation = "horizontal",
      direction = "ltr",
      loop = false,
      class: className,
      ...divProps
    } = props;

    const commonProps = {
      role: "group",
      "aria-orientation": orientation,
      dir: direction,
      "aria-disabled": disabled,
    };

    const api = useSegmentedButtonSet(props);

    const rootApiContext: SegmentedButtonSetContextValue = {
      rootId: api.rootId,
      rootOrientation: orientation,
      rootDirection: direction,
      rootIsDisabled: disabled,
      rootIsLoopEnabled: loop,
      rootMultiple: api.multiple,
      activateItem$: api.activateItem$,
      deActivateItem$: api.deActivateItem$,
      getAllItem$: api.getAllItems$,
      selectedValuesSig: api.selectedValuesSig,
      getAndSetTabIndexItem$: api.getAndSetTabIndexItem$,
      registerItem$: api.registerItem$,
      itemsCSR: api.itemsCSR,
    };

    const setTabIndexInSSR = $(async () => {
      const allItems = await rootApiContext.getAllItem$();

      //if selectedItems exist, we set them to tabIndex = 0
      const currentSelectedItems = allItems.filter(
        (item) => item.isSelected.value === true,
      );

      if (currentSelectedItems.length > 0) {
        currentSelectedItems.forEach(async (item) => {
          await rootApiContext.getAndSetTabIndexItem$(item.itemId, 0);
        });

        //and we ensure that the rest of items has tabIndex = -1
        allItems
          .filter((item) => item.isSelected.value === false)
          .forEach(async (item) => {
            await rootApiContext.getAndSetTabIndexItem$(item.itemId, -1);
          });

        return;
      }
      //However, if no selectedItems exit, we only set tabIndex = 0 on the first item that is not disabled
      const firstNotDisabledItem = allItems.find(
        (item) => item.isDisabled === false,
      );

      if (
        currentSelectedItems.length === 0 &&
        firstNotDisabledItem !== undefined
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (firstNotDisabledItem !== undefined) {
          await rootApiContext.getAndSetTabIndexItem$(
            firstNotDisabledItem.itemId,
            0,
          );
        }

        //and we ensure that the rest of items has tabIndex = -1
        allItems
          .filter((item) => item.itemId !== firstNotDisabledItem.itemId)
          .forEach(async (item) => {
            await rootApiContext.getAndSetTabIndexItem$(item.itemId, -1);
          });

        return;
      }
    });

    const setTabIndexInCSR = $(async () => {
      /*
      Note: given a "single" toggle group with one item already selected. 
      - if we use: const allItems = rootApiContext.itemsCSR.value;
      - and we lookup for the currentSelectedItems, we will get 2 items (the previous and the current)
      For that reason to get the currentSelectedItems we use: rootApiContext.getAllItem$()
      However to get the firstNotDisabledItem, we need to use rootApiContext.itemsCSR.value (refs directly)
      as rootApiContext.getAllItem$() will be "out of order".
  
      Ideally, if rootApiContext.getAllItem$() would be in appropriate order, we could use the same logic
      for SSR and CSR. 
      In should be the case in v2, so we will refactor so both SSR and CSR will use the same API.
  
  
      The other solution that I consider was:
      to have a similar logic "setTabIndexInCSR" but this time which only use the refs
      meaning (rootApiContext.itemsCSR.value) within the "toggle-group-item": 
        useTask$(async ({ track }) => {
          if (isServer) return;
          track(() => rootApiContext.selectedValuesSig.value);
            await setTabIndexInCSR();
        });
      
      However, I decide to use that function in Root to avoid execute that same logic X times
      (X being the number of items) and the fact that Items are consumers that should work in isolation.
      They should not execute logic for other Items. This is what Root should do.
      */
      const allItems = await rootApiContext.getAllItem$();
      //if selectedItems exist, we set them to tabIndex = 0
      const currentSelectedItems = allItems.filter(
        (item) => item.isSelected.value === true,
      );

      if (currentSelectedItems.length > 0) {
        currentSelectedItems.forEach(async (item) => {
          const selectedItem = allItems.find((i) => i.itemId === item.itemId);
          if (!selectedItem) throw "Item Not Found";
          if (selectedItem.ref.value) {
            selectedItem.ref.value.tabIndex = 0;
          }
        });

        //and we ensure that the rest of items has tabIndex = -1
        allItems
          .filter((item) => item.isSelected.value === false)
          .forEach(async (item) => {
            const notSelectedItem = allItems.find(
              (i) => i.itemId === item.itemId,
            );
            if (!notSelectedItem) throw "Item Not Found";
            if (notSelectedItem.ref.value) {
              notSelectedItem.ref.value.tabIndex = -1;
            }
          });

        return;
      }

      //However, if no selectedItems exit, we only set tabIndex = 0 on the first item that is not disabled
      /*
      Unfortunately, rootApiContext.itemsCSR.value is empty because in the toggle-group-item
      the first useTask is tracking the selectedValue changes.
      If we put that task at the bottom, we will get the register itemsRef in rootApiContext.itemsCSR.value.
      However it will cause other misbehavior. 
  
      Instead the safe way is to populate manually using the "document".
      In v2, we will not this all those workarounds as the items will be in order and we will use the same API for both SSR and CSR.
      */
      rootApiContext.itemsCSR.value = Array.from(
        document.querySelectorAll(
          `.toggle-group-item-${rootApiContext.rootId}`,
        ),
      ) as HTMLElement[];

      const firstNotDisabledItem = rootApiContext.itemsCSR.value.find(
        (item) => item.ariaDisabled === "false",
      );

      if (
        currentSelectedItems.length === 0 &&
        firstNotDisabledItem !== undefined
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (firstNotDisabledItem !== undefined) {
          firstNotDisabledItem.tabIndex = 0;
        }

        //and we ensure that the rest of items has tabIndex = -1
        allItems
          .filter((item) => item.itemId !== firstNotDisabledItem.id)
          .forEach(async (item) => {
            const otherItem = allItems.find((i) => i.itemId === item.itemId);
            if (!otherItem) throw "Item Not Found";
            if (otherItem.ref.value) {
              otherItem.ref.value.tabIndex = -1;
            }
          });

        return;
      }
    });

    /*
    TODO: optimize this code to make it faster (its a library)
    Optimization = use a for loop instead of iterating multiple times.
    Status: As the SegmentedButtonSet component is in "Draft" state, I decided to not optimize it for now.
    As it will decrease readability even more.
    Decision: wait for v2, to refactor the code and have the same API for both SSR and CSR.
    And then make the optimization.
    */
    //side-effect, to setTabIndex
    useTask$(async ({ track }) => {
      track(api.selectedValuesSig);

      if (isServer) {
        await setTabIndexInSSR();
      }

      if (isBrowser) {
        await setTabIndexInCSR();
      }
    });

    useContextProvider(SegmentedButtonSetContext, rootApiContext);

    return (
      <div
        {...divProps}
        {...commonProps}
        class={cn(
          segmentedButtonSetVariants({
            orientation,
          }),
          className,
        )}
        role="group"
      >
        <Slot />
      </div>
    );
  },
);
