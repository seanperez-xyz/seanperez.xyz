import { component$ } from "@builder.io/qwik";
import { cn } from "~/utils";
import type { ElevationProps } from "./elevation.types";

/**
 * A component for elevation shadows that follows Material Design elevation system.
 */
export const Elevation = component$<ElevationProps>(({ level = 0 }) => {
  return (
    <div
      aria-hidden="true"
      class={cn(
        // Host styles (:host equivalent)
        "relative h-full w-full",
        "pointer-events-none",
        // Inherit container styles
        "rounded-[inherit]",
        // Shadow container
        "before:absolute before:inset-0",
        "before:rounded-[inherit]",
        "before:content-['']",
        "before:duration-[inherit] before:ease-[inherit] before:transition-shadow",
        "after:absolute after:inset-0",
        "after:rounded-[inherit]",
        "after:content-['']",
        "after:duration-[inherit] after:ease-[inherit] after:transition-shadow",
        // Shadow calculations based on level
        level === 0 && ["before:shadow-none", "after:shadow-none"],
        level === 1 && [
          "before:[box-shadow:0px_1px_2px_0px_rgba(0,0,0,0.3)]",
          "after:[box-shadow:0px_1px_3px_1px_rgba(0,0,0,0.15)]",
        ],
        level === 2 && [
          "before:[box-shadow:0px_1px_2px_0px_rgba(0,0,0,0.3)]",
          "after:[box-shadow:0px_2px_6px_2px_rgba(0,0,0,0.15)]",
        ],
        level === 3 && [
          "before:[box-shadow:0px_1px_3px_0px_rgba(0,0,0,0.3)]",
          "after:[box-shadow:0px_4px_8px_3px_rgba(0,0,0,0.15)]",
        ],
        level === 4 && [
          "before:[box-shadow:0px_2px_3px_0px_rgba(0,0,0,0.3)]",
          "after:[box-shadow:0px_6px_10px_4px_rgba(0,0,0,0.15)]",
        ],
        level === 5 && [
          "before:[box-shadow:0px_4px_4px_0px_rgba(0,0,0,0.3)]",
          "after:[box-shadow:0px_8px_12px_6px_rgba(0,0,0,0.15)]",
        ],
      )}
    />
  );
});
