import { component$, useComputed$ } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  [
    "absolute",
    "start-[50%]",
    "top-0",
    "text-label-small font-medium",
    "rounded-full",
    "shadow-elevation-1",
  ],
  {
    variants: {
      variant: {
        default: ["bg-error text-on-error"],
      },
      size: {
        default: ["h-1.5 w-1.5", "ms-1.5 mt-0.5"],
        large: [
          "h-4 min-w-4",
          "ms-0.5 mt-[0.063rem]",
          "flex flex-col justify-center",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  value?: string | number;
  class?: string;
}

export const Badge = component$<BadgeProps>(
  ({ value, variant, class: className }) => {
    const isLarge = useComputed$(
      () =>
        typeof value === "string" || (typeof value === "number" && value > 1),
    );

    return (
      <div
        class={badgeVariants({
          variant,
          size: isLarge.value ? "large" : "default",
          class: className,
        })}
      >
        {isLarge.value && <span class="px-1 py-0 text-center">{value}</span>}
      </div>
    );
  },
);
