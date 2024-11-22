import type { PropsOf } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";

const labelVariants = cva(
  [
    "absolute left-3",
    "pointer-events-none",
    "transform transition-all duration-200 ease-out",
    "text-on-surface-variant",
    "top-1/2 -translate-y-1/2",
  ],
  {
    variants: {
      variant: {
        outlined: [
          "peer-focus:-top-2.5 peer-focus:text-body-small peer-focus:translate-y-0",
          "peer-[&:not(:placeholder-shown)]:-top-2.5 peer-[&:not(:placeholder-shown)]:text-body-small peer-[&:not(:placeholder-shown)]:translate-y-0",
          "peer-focus:[background-color:var(--field-bg,theme(colors.surface))] peer-focus:px-1",
          "peer-[&:not(:placeholder-shown)]:[background-color:var(--field-bg,theme(colors.surface))] peer-[&:not(:placeholder-shown)]:px-1",
          "peer-focus:text-primary",
          "peer-[&[aria-invalid=true]]:text-error",
          "peer-disabled:text-on-surface/38",
        ],
        filled: [
          "peer-focus:top-2 peer-focus:text-body-small peer-focus:translate-y-0",
          "peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-body-small peer-[&:not(:placeholder-shown)]:translate-y-0",
          "peer-focus:text-primary",
          "peer-[&[aria-invalid=true]]:text-error",
          "peer-disabled:text-on-surface/38",
        ],
      },
      type: {
        input: "",
        textarea: "top-6",
      },
      size: {
        default: "text-body-large",
        small: "text-body-small",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "default",
      type: "input",
    },
  },
);

export interface TextFieldLabelProps
  extends PropsOf<"label">,
    VariantProps<typeof labelVariants> {
  label?: string;
  required?: boolean;
}

export const TextFieldLabel = component$<TextFieldLabelProps>(
  ({ label, required, variant, size, type, ...props }) => {
    if (!label) return null;

    return (
      <label {...props} class={labelVariants({ variant, size, type })}>
        {label}
        {required && (
          <span class="ml-1 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  },
);
