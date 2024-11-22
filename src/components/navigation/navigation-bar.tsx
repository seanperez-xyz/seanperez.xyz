import type { QRL } from "@builder.io/qwik";
import {
  Slot,
  component$,
  $,
  sync$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
//
import { cn } from "~/utils";
import type { NavigationContextValue } from "./navigation-context";
import { NavigationContext } from "./navigation-context";

interface NavigationBarProps {
  initialActiveIndex?: number;
  hideInactiveLabels?: boolean;
  class?: string;
  onTabChange$?: QRL<(index: number) => void>;
}

export const NavigationBar = component$<NavigationBarProps>(
  ({
    class: className,
    onTabChange$,
    initialActiveIndex = 0,
    hideInactiveLabels,
  }) => {
    const navigationStore = useStore<NavigationContextValue>({
      activeIndex: initialActiveIndex,
      hideInactiveLabels,
      tabs: [],
      registerTab: $(function (this: NavigationContextValue, index: number) {
        if (!this.tabs.some((tab) => tab.index === index)) {
          this.tabs.push({ index, active: this.activeIndex === index });
        }
      }),
    });

    useContextProvider(NavigationContext, navigationStore);

    const handleKeyNavigation$ = $((e: KeyboardEvent) => {
      const currentIndex = navigationStore.activeIndex;
      const tabsLength = navigationStore.tabs.length;
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp": {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabsLength - 1;
          break;
        }
        case "ArrowRight":
        case "ArrowDown": {
          nextIndex = currentIndex < tabsLength - 1 ? currentIndex + 1 : 0;
          break;
        }
        case "Home": {
          nextIndex = 0;
          break;
        }
        case "End": {
          nextIndex = tabsLength - 1;
          break;
        }
        default:
          return;
      }

      navigationStore.activeIndex = nextIndex;
      navigationStore.tabs.forEach((tab) => {
        tab.active = tab.index === nextIndex;
      });

      onTabChange$?.(nextIndex);
    });

    return (
      <nav
        role="tablist"
        aria-orientation="horizontal"
        class={cn(
          "relative flex w-full",
          "h-20",
          "bg-surface-container",
          "shadow-elevation-3",
          "transition-shadow duration-280 ease-emphasized",
          className,
        )}
        onKeyDown$={[
          sync$((e: KeyboardEvent) => {
            if (
              [
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End",
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          }),
          handleKeyNavigation$,
        ]}
      >
        <Slot />
      </nav>
    );
  },
);
