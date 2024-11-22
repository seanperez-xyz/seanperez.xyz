import { component$, useComputed$, type PropsOf } from "@builder.io/qwik";
//
import { cn } from "~/utils";

export interface TextFieldSupportingTextProps extends PropsOf<"div"> {
  error?: string;
  supportingText?: string;
  name: string;
}

export const TextFieldSupportingText = component$<TextFieldSupportingTextProps>(
  ({ error, name, supportingText, ...props }) => {
    const text = useComputed$(() => error || supportingText);
    if (!text.value) return null;

    return (
      <div
        {...props}
        id={name + "-description"}
        class={cn(
          "my-1 px-4 text-body-small ",
          "text-on-surface-variant",
          error ? "text-error" : "text-on-surface-variant",
          "peer-disabled:text-on-surface/38",
        )}
      >
        {text}
      </div>
    );
  },
);
