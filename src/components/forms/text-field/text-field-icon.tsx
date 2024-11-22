import type { PropsOf } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
//
import { cn } from "~/utils";

export interface TextFieldIconProps extends PropsOf<"div"> {
  position: "leading" | "trailing";
  size?: "small" | "default";
}

export const TextFieldIcon = component$<TextFieldIconProps>(
  ({ position, size = "default", ...props }) => {
    return (
      <div
        {...props}
        class={cn(
          "relative flex items-center justify-center fill-current text-current",
          position === "leading" ? "left-3" : "right-3",
          "top-1/2 -translate-y-1/2",
          size === "small" ? "h-5 w-5" : "h-6 w-6",
          "text-on-surface-variant",
          "peer-focus:text-primary",
          "[&:has(~ [aria-invalid=true])]:text-error",
          "peer-disabled:text-on-surface/38",
          "*:absolute *:flex",
        )}
      >
        <Slot />
      </div>
    );
  },
);
