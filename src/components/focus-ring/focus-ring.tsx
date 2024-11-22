import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { FocusRingProps } from "./focus-ring.types";
import { cn } from "~/utils";

const EVENTS = ["focusin", "focusout", "pointerdown"];

export const FocusRing = component$<FocusRingProps>(
  ({
    visible: initialVisible = false,
    inward = false,
    control,
    onVisibleChange$,
  }) => {
    const isVisible = useSignal(initialVisible);

    const handleEvent = $((event: Event) => {
      switch (event.type) {
        case "focusin":
          const newVisible = control?.matches(":focus-visible") ?? false;
          isVisible.value = newVisible;
          onVisibleChange$?.(newVisible);
          break;
        case "focusout":
        case "pointerdown":
          isVisible.value = false;
          onVisibleChange$?.(false);
          break;
      }
    });

    useTask$(({ cleanup }) => {
      if (!control) return;

      EVENTS.forEach((event) => {
        control.addEventListener(event, handleEvent);
      });

      cleanup(() => {
        EVENTS.forEach((event) => {
          control.removeEventListener(event, handleEvent);
        });
      });
    });

    return (
      <div
        aria-hidden="true"
        class={cn(
          // Base styles
          "pointer-events-none absolute box-border hidden",
          // Animation styles
          "motion-safe:duration-[500ms]",
          "motion-safe:ease-[cubic-bezier(0.3,0,0,1)]",
          // Visibility
          isVisible.value && "flex",
          // Inward/Outward variants
          inward
            ? [
                "border-solid border-secondary",
                isVisible.value
                  ? "animate-inward-grow"
                  : "animate-inward-shrink",
                "delay-[0ms,125ms]",
              ]
            : [
                "outline outline-secondary",
                isVisible.value
                  ? "animate-outward-grow"
                  : "animate-outward-shrink",
                "delay-[0ms,125ms]",
              ],
          // Positioning and offsets
          inward ? "inset-0.5" : "-inset-0.5",
          // Border/Outline widths
          inward ? "border-[3px]" : "outline-3",
          // Border radius
          "rounded-full",
        )}
      />
    );
  },
);
