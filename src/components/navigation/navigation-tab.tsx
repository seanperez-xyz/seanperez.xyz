import type { QRL } from "@builder.io/qwik";
import {
  component$,
  Slot,
  $,
  useContext,
  useComputed$,
  useTask$,
  useSignal,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
//
import { NavigationContext } from "./navigation-context";
import { Badge } from "~/components/ui/badge";

interface NavigationTabProps {
  index: number;
  onInteraction$?: QRL<(index: number) => void>;
  label?: string;
  badgeValue?: string;
  disabled?: boolean;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export const NavigationTab = component$<NavigationTabProps>(
  ({ index, disabled, label, badgeValue, onInteraction$, ...props }) => {
    const ctx = useContext(NavigationContext);
    const tabRef = useSignal<HTMLElement>();
    const active = useComputed$(() => {
      if (ctx.activeIndex === index) {
        tabRef.value?.focus();
        return true;
      }
      return false;
    });

    useTask$(() => {
      ctx.registerTab(index);
    });

    const handleInteraction$ = $(() => {
      if (!disabled) {
        ctx.activeIndex = index;
        ctx.tabs.forEach((tab) => {
          tab.active = tab.index === index;
        });
        onInteraction$?.(index);
      }
    });

    const Tag = props.href
      ? props.target === "_blank"
        ? "a"
        : Link
      : "button";

    return (
      <Tag
        ref={tabRef}
        class={[
          "group relative flex h-full w-full flex-col items-center justify-center",
          "appearance-none border-none bg-transparent px-0 py-0",
          "min-h-12 min-w-12",
          "text-label-medium",
          "cursor-pointer",
          "disabled:cursor-not-allowed disabled:opacity-38",
          "outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-secondary focus-visible:ring-offset-0",
        ]}
        role="tab"
        aria-selected={active.value}
        id={`tab-${index}`}
        aria-disabled={disabled}
        aria-label={label}
        href={props.href}
        target={props.target}
        tabIndex={active.value ? 0 : -1}
        disabled={disabled}
        onClick$={handleInteraction$}
      >
        <span
          aria-hidden="true"
          class="relative flex items-center justify-center"
        >
          {/* Active indicator */}
          <span
            class={[
              "absolute flex justify-center",
              "h-8 w-8",
              "rounded-full",
              "transition-[width,background-color] duration-short-2 ease-standard",
              // Unselected states
              "group-hover:w-16 group-hover:bg-on-surface/8",
              "group-focus:w-16 group-focus:bg-on-surface/12",
              "group-active:w-16 group-active:bg-on-surface/12",
              // Selected states
              "group-aria-selected:w-16 group-aria-selected:bg-secondary-container",
              "group-aria-selected:group-hover:w-16 group-aria-selected:group-hover:bg-secondary-container/92",
              "group-aria-selected:group-focus:w-16 group-aria-selected:group-focus:bg-secondary-container/88",
              "group-aria-selected:group-active:bg-secondary-container/84 group-aria-selected:group-active:w-16",
            ]}
          />
          {/* Icon */}
          <span
            class={[
              "relative h-6 w-6",
              "transition-colors duration-short-2 ease-standard",
              // Unselected states
              "text-on-surface-variant",
              "group-hover:text-on-surface",
              "fill-current",
              "group-focus:text-on-surface",
              "group-active:text-on-surface",
              // Selected states
              "group-aria-selected:text-on-secondary-container",
              "group-aria-selected:group-hover:text-on-secondary-container",
              "group-aria-selected:group-focus:text-on-secondary-container",
              "group-aria-selected:group-active:text-on-secondary-container",
            ]}
          >
            <Slot name="icon" />
          </span>
          {/* Badge */}
          {badgeValue && <Badge value={badgeValue} />}
        </span>

        {/* Label */}
        {label && (
          <span
            class={[
              "mt-1",
              "transition-[opacity,height] duration-short-2 ease-standard",
              "text-label-medium",
              // Unselected states
              "text-on-surface-variant",
              "group-hover:text-on-surface",
              "group-focus:text-on-surface",
              "group-active:text-on-surface",
              // Selected states
              "group-aria-selected:text-on-surface",
              "group-aria-selected:font-bold",
              "group-aria-selected:group-hover:text-on-surface/92",
              "group-aria-selected:group-focus:text-on-surface/88",
              "group-aria-selected:group-active:text-on-surface/84",
              // Hide inactive labels
              ctx.hideInactiveLabels && "h-0 opacity-0",
            ]}
          >
            {label}
          </span>
        )}
      </Tag>
    );
  },
);
