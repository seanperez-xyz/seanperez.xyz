import {
  component$,
  Slot,
  useContextProvider,
  $,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import type { MenuProps } from "./menu.types";
import { MenuContext, type MenuState } from "./menu-context";
import { FocusState } from "./shared";
import { useMenuPosition } from "./use-menu-position";
import { useTypeahead } from "./use-typeahead";
import { useKeyboardNavigation } from "./use-keyboard-navigation";
import { cn } from "~/utils";

export const MenuRoot = component$<MenuProps>(
  ({
    open = false,
    quick = false,
    positioning = "absolute",
    anchorCorner = "start-end",
    menuCorner = "start-start",
    hasOverflow = false,
    xOffset = 0,
    yOffset = 0,
    defaultFocus = FocusState.NONE,
    onSelect$,
  }) => {
    const { position, updatePosition } = useMenuPosition({
      positioning,
      anchorCorner,
      menuCorner,
      xOffset,
      yOffset,
    });

    const { handleKeydown: handleTypeahead } = useTypeahead();
    const { handleNavigation } = useKeyboardNavigation();

    const state = useStore<MenuState>({
      isOpen: open,
      position: position.styles,
      focusedItemIndex: -1,
      items: [],
      defaultFocus,
      anchorCorner,
      menuCorner,
      quick,
      selectedItem: undefined,
      timeoutId: undefined,
      menuRef: undefined,
      anchorRef: undefined,
    });

    const show = $(() => {
      state.isOpen = true;
      requestAnimationFrame(() => {
        if (state.items.length) {
          switch (defaultFocus) {
            case FocusState.FIRST_ITEM:
              state.focusedItemIndex = 0;
              state.items[0]?.focus();
              break;
            case FocusState.LAST_ITEM:
              state.focusedItemIndex = state.items.length - 1;
              state.items[state.items.length - 1]?.focus();
              break;
            case FocusState.LIST_ROOT:
              state.focusedItemIndex = -1;
              state.menuRef?.focus();
              break;
          }
        }
      });
    });

    const hide = $(() => {
      state.isOpen = false;
      state.focusedItemIndex = -1;
    });

    const toggle = $(() => {
      if (state.isOpen) hide();
      else show();
    });

    const registerItem = $((item: HTMLElement) => {
      state.items = [...state.items, item];
    });

    const unregisterItem = $((item: HTMLElement) => {
      state.items = state.items.filter((i) => i !== item);
    });

    const selectItem = $((item: HTMLElement) => {
      state.selectedItem = item;
      onSelect$?.(item);
    });

    const setTimeout = $((fn: () => void, delay: number) => {
      if (state.timeoutId) {
        window.clearTimeout(state.timeoutId);
      }
      state.timeoutId = window.setTimeout(fn, delay);
    });

    const clearTimeout = $(() => {
      if (state.timeoutId) {
        window.clearTimeout(state.timeoutId);
        state.timeoutId = undefined;
      }
    });

    useContextProvider(MenuContext, {
      state,
      show,
      hide,
      toggle,
      registerItem,
      unregisterItem,
      selectItem,
      setTimeout,
      clearTimeout,
    });

    useTask$(({ track }) => {
      track(() => state.isOpen);
      if (state.isOpen) {
        updatePosition();
      }
    });

    return (
      <div ref={(el) => (state.anchorRef = el)} class="inline-block">
        <Slot name="anchor" />

        <div
          ref={(el) => (state.menuRef = el)}
          class={cn(
            "max-w-70 min-w-28 py-2",
            "rounded-sm bg-surface-container-low",
            "shadow-elevation-2",
            "origin-top-left transform-gpu",
            "transition-all duration-medium-2 ease-emphasized",
            "transition-opacity duration-75",
            "aria-hidden:pointer-events-none aria-hidden:scale-90 aria-hidden:opacity-0",
            "aria-expanded:scale-100 aria-expanded:opacity-100",
            hasOverflow ? "overflow-visible" : "overflow-hidden",
            quick && "transition-none",
          )}
          role="menu"
          aria-hidden={!state.isOpen}
          aria-expanded={state.isOpen}
          style={position.styles}
          preventdefault:keydown
          onKeyDown$={async (e) => {
            if (state.items.length) {
              handleTypeahead(e, state.items);
              const result = await handleNavigation(e, state.items);
              if (result?.close) {
                hide();
              }
            }
          }}
        >
          <div class="flex flex-col">
            <Slot />
          </div>
        </div>
      </div>
    );
  },
);
