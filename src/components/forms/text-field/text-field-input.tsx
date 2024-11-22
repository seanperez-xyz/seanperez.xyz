import type { PropsOf } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils";

const textFieldInputVariants = cva(
  [
    "peer w-full bg-transparent",
    "text-on-surface outline-none text-body-large",
    "overflow-x-hidden text-inherit",
    "[-webkit-tap-highlight-color:transparent]",
    // Placeholder styles
    "placeholder:text-current placeholder:opacity-100",
    // Caret colors
    "caret-primary",
    // Input states
    "disabled:text-on-surface/38 disabled:cursor-not-allowed",
    "focus-within:caret-primary",
    "[&[aria-invalid=true]]:caret-error",
    // Remove browser UI elements
    "[&::-webkit-calendar-picker-indicator]:hidden",
    "[&::-webkit-search-decoration]:hidden",
    "[&::-webkit-search-cancel-button]:hidden",
    "[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden",
    "[&[type=number]]:appearance-textfield",
    // High contrast mode
    "forced-colors::bg-none",
  ],
  {
    variants: {
      variant: {
        outlined: "px-3 py-4",
        filled: ["px-3", "bg-surface-container-highest"],
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y [&::-webkit-resizer]:hidden",
        horizontal: "resize-x [&::-webkit-resizer]:hidden",
        both: "resize [&::-webkit-resizer]:hidden",
      },
    },
    defaultVariants: {
      resize: "none",
      variant: "outlined",
    },
  },
);

type BaseProps = Omit<
  VariantProps<typeof textFieldInputVariants>,
  "hasLeadingIcon" | "hasTrailingIcon"
> & {
  type?: "text" | "email" | "password" | "tel" | "url" | "textarea";
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  error?: string;
};

type InputProps = BaseProps & PropsOf<"input">;
type TextAreaProps = BaseProps & PropsOf<"textarea">;

export type TextFieldInputProps = InputProps | TextAreaProps;

export const TextFieldInput = component$<TextFieldInputProps>(
  ({
    error,
    hasLeadingIcon,
    hasTrailingIcon,
    resize,
    type,
    variant,
    ...props
  }) => {
    console.log("Variant received:", variant);

    return type === "textarea" ? (
      <textarea
        {...(props as TextAreaProps)}
        aria-invalid={!!error}
        class={cn(
          textFieldInputVariants({ resize, variant: variant }),
          "py-2",
          hasLeadingIcon && "pl-12",
          hasTrailingIcon && "pr-12",
        )}
      />
    ) : (
      <input
        {...(props as InputProps)}
        aria-invalid={!!error}
        class={cn(
          textFieldInputVariants({ resize, variant }),
          "py-4",
          hasLeadingIcon && "pl-12",
          hasTrailingIcon && "pr-12",
        )}
      />
    );
  },
);
