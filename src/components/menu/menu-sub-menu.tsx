import { component$, Slot, useSignal, $, useContext } from "@builder.io/qwik";
import type { MenuSubMenuProps } from "./menu-sub-menu.types";
import { cn } from "~/utils";
import { MenuContext } from "./menu-context";

export const MenuSubMenu = component$<MenuSubMenuProps>(
  ({ hoverOpenDelay = 400, hoverCloseDelay = 400 }) => {
    const isOpen = useSignal(false);
    const subMenuRef = useSignal<HTMLElement>();
    const menu = useContext(MenuContext);

    const handleMouseEnter = $(() => {
      menu.clearTimeout();
      menu.setTimeout(() => {
        isOpen.value = true;
      }, hoverOpenDelay);
    });

    const handleMouseLeave = $(() => {
      menu.clearTimeout();
      menu.setTimeout(() => {
        isOpen.value = false;
      }, hoverCloseDelay);
    });

    return (
      <div
        ref={subMenuRef}
        class="relative"
        onMouseEnter$={handleMouseEnter}
        onMouseLeave$={handleMouseLeave}
      >
        <div
          class="flex items-center"
          role="menuitem"
          aria-haspopup="menu"
          aria-expanded={isOpen.value}
        >
          <Slot name="trigger" />
        </div>

        <div
          class={cn(
            "absolute left-full top-0 ml-1",
            "min-w-28 rounded-sm bg-surface-container-low py-2",
            "shadow-elevation-2 transition-opacity duration-medium-2",
            "pointer-events-none opacity-0",
            "aria-expanded:pointer-events-auto aria-expanded:opacity-100",
          )}
          role="menu"
          aria-expanded={isOpen.value}
        >
          <Slot />
        </div>
      </div>
    );
  },
);
