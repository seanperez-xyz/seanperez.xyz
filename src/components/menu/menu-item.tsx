import {
  $,
  component$,
  Slot,
  useContext,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import type { MenuItemProps } from "./menu-item.types";
import { MenuContext } from "./menu-context";
import { cn } from "~/utils";
import { Link } from "@builder.io/qwik-city";

/**
 * @fires close-menu {CustomEvent<{initiator: SelectOption, reason: Reason, itemPath: SelectOption[]}>}
 * Closes the encapsulating menu on closable interaction. --bubbles --composed
 */
export const MenuItem = component$<MenuItemProps>(
  ({
    disabled = false,
    type = "menuitem",
    keepOpen = false,
    selected = false,
    onSelect$,
    href,
    target,
  }) => {
    const itemRef = useSignal<HTMLElement>();
    const menu = useContext(MenuContext);

    // Register/unregister with menu context
    useTask$(({ cleanup }) => {
      if (itemRef.value) {
        menu.registerItem(itemRef.value);
        cleanup(() => menu.unregisterItem(itemRef.value!));
      }
    });

    const handleClick = $(() => {
      if (disabled) return;
      if (!keepOpen) menu.hide();
      menu.selectItem(itemRef.value!);
      onSelect$?.();
    });

    const Tag = href ? (target === "_blank" ? Link : "a") : "li";

    return (
      <Tag
        ref={itemRef}
        {...(href ? { href, target } : {})}
        class={cn(
          "relative flex min-h-12 w-full cursor-pointer",
          "items-center justify-start gap-4 px-3 py-2",
          "text-label-large font-medium text-on-surface",
          "outline-none transition-colors duration-medium-2",
          "hover:bg-primary/4 focus-visible:bg-primary/12 active:bg-primary/16",
          "aria-disabled:pointer-events-none aria-disabled:opacity-38",
          type.includes("menuitem") &&
            "aria-selected:bg-secondary-container aria-selected:text-on-secondary-container",
        )}
        role={type}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-selected={selected}
        onClick$={handleClick}
      >
        <div class="flex min-w-0 flex-1 items-center gap-4">
          <Slot name="start" />
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <div class="truncate">
              <Slot />
            </div>
            <div class="truncate text-body-medium text-on-surface-variant">
              <Slot name="supporting-text" />
            </div>
          </div>
          <Slot name="end" />
        </div>
      </Tag>
    );
  },
);
