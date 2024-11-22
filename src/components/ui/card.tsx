import type { PropsOf } from "@builder.io/qwik";
import { component$, Slot } from "@builder.io/qwik";
//
import { cn } from "~/utils";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const cardVariants = cva(
  [
    "relative flex flex-col w-full",
    "transition-all duration-medium-2 ease-standard",
    "min-w-75",
    "rounded-xl",
  ],
  {
    variants: {
      variant: {
        elevated: [
          "bg-surface-container-low",
          "[--field-bg:theme(colors.surface-container-low)]",
          "shadow-elevation-1",
          // Disabled state
          "disabled:shadow-elevation-1 disabled:bg-surface-container",
        ],
        filled: [
          "bg-surface-container-highest",
          "[--field-bg:theme(colors.surface-container-highest)]",
          "shadow-elevation-1",
          // Disabled state
          "disabled:shadow-none disabled:bg-surface-container",
        ],
        outlined: [
          "bg-surface",
          "[--field-bg:theme(colors.surface)]",
          "border border-outline",
          // Disabled state
          "disabled:border-outline/38",
        ],
      },
      clickable: {
        true: [
          "cursor-pointer",
          "transition-transform duration-short-4",
          "active:press",
          // Focus states
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/12",
        ],
        false: "",
      },
      draggable: {
        true: [
          "cursor-move",
          "touch-action-none",
          "select-none",
          "active:shadow-elevation-3",
          "active:scale-[1.02]",
        ],
        false: "",
      },
      disabled: {
        true: ["pointer-events-none", "opacity-38"],
        false: "",
      },
    },
    compoundVariants: [
      // Interactive states for clickable cards
      {
        clickable: true,
        variant: "elevated",
        className:
          "hover:shadow-elevation-3 hover:bg-primary/8 active:shadow-elevation-1 active:bg-primary/12",
      },
      {
        clickable: true,
        variant: "filled",
        className:
          "hover:shadow-elevation-2 hover:bg-primary/8 active:shadow-none active:bg-primary/12",
      },
      {
        clickable: true,
        variant: "outlined",
        className:
          "hover:border-primary/50 hover:bg-primary/8 active:bg-primary/12",
      },
    ],
    defaultVariants: {
      variant: "elevated",
      clickable: false,
      draggable: false,
      disabled: false,
    },
  },
);

const Card = component$<PropsOf<"section"> & VariantProps<typeof cardVariants>>(
  ({ class: className, variant, clickable, draggable, disabled, ...props }) => (
    <section
      class={cn(
        cardVariants({ variant, clickable, draggable, disabled }),
        className,
      )}
      {...props}
    >
      <Slot />
    </section>
  ),
);

const CardHeader = component$<PropsOf<"header">>(
  ({ class: className, ...props }) => (
    <header class={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      <Slot />
    </header>
  ),
);

const CardTitle = component$<PropsOf<"h3">>(
  ({ class: className, ...props }) => (
    <h3
      class={cn(
        "font-medium leading-none tracking-tight text-primary",
        className,
      )}
      {...props}
    >
      <Slot />
    </h3>
  ),
);

const CardDescription = component$<PropsOf<"p">>(
  ({ class: className, ...props }) => (
    <p class={cn("text-sm text-secondary", className)} {...props}>
      <Slot />
    </p>
  ),
);

const CardContent = component$<PropsOf<"article">>(
  ({ class: className, ...props }) => (
    <article class={cn("p-6 pt-0", className)} {...props}>
      <Slot />
    </article>
  ),
);

const CardFooter = component$<PropsOf<"footer">>(
  ({ class: className, ...props }) => (
    <footer class={cn("flex items-center p-6 pt-0", className)} {...props}>
      <Slot />
    </footer>
  ),
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
