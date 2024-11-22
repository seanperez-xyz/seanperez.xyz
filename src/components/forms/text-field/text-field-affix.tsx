import type { PropsOf } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
//
import { cn } from "~/utils";

export interface TextFieldAffixProps extends PropsOf<"span"> {
  text: string;
  type: "prefix" | "suffix";
}

export const TextFieldAffix = component$<TextFieldAffixProps>(
  ({ text, type, ...props }) => {
    return (
      <span
        {...props}
        class={cn(
          type === "prefix" ? "prefix" : "suffix",
          "w-min text-nowrap",
          "text-on-surface-variant",
          "[&:has(~ [aria-invalid=true])]:text-error",
          "peer-disabled:text-on-surface/38",
          type === "prefix" ? "pe-2" : "ps-2",
        )}
      >
        {text}
      </span>
    );
  },
);
