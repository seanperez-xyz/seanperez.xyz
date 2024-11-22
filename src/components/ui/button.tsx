import type { PropsOf, QRL } from "@builder.io/qwik";
import { $, component$, Slot, useSignal } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";
import { LuLoader2 } from "@qwikest/icons/lucide";
//
import { cn } from "~/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center relative text-sm font-medium select-none disabled:pointer-events-none disabled:opacity-38",
  {
    variants: {
      look: {
        elevated: [
          "bg-surface text-on-surface",
          "min-w-[3rem]",
          "shadow-elevation-1",
          "transition-[box-shadow,background] duration-200",
          "hover:shadow-elevation-2",
          "active:shadow-elevation-1",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:transition-colors before:duration-200",
          "hover:before:bg-on-surface/8",
          "active:before:bg-on-surface/12",
        ],
        filled: [
          "bg-primary text-on-primary",
          "min-w-[3rem]",
          "transition-[background] duration-200",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:transition-colors before:duration-200",
          "hover:before:bg-on-primary/8",
          "active:before:bg-on-primary/12",
        ],
        tonal: [
          "bg-secondary-container text-on-secondary-container",
          "min-w-[3rem]",
          "transition-[background] duration-200",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:transition-colors before:duration-200",
          "hover:before:bg-on-secondary-container/8",
          "active:before:bg-on-secondary-container/12",
        ],
        outlined: [
          "border border-outline text-primary",
          "min-w-[3rem]",
          "transition-colors duration-200",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:transition-colors before:duration-200",
          "hover:before:bg-primary/8",
          "active:before:bg-primary/12",
        ],
        text: [
          "text-primary",
          "min-w-[3rem]",
          "transition-colors duration-200",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:transition-colors before:duration-200",
          "hover:before:bg-primary/8",
          "active:before:bg-primary/12",
        ],
      },
      size: {
        sm: "h-10 px-4 py-2.5 text-sm", // 40px height
        md: "h-12 px-6 py-2.5", // 48px height
        lg: "h-14 px-8 py-4", // 56px height
        icon: "h-10 w-10 p-2", // 40px square
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      look: "filled",
      size: "md",
      rounded: "full",
    },
  },
);

export type ButtonProps = ButtonDivProps & (ButtonProp | DivProp);
export interface ButtonDivProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onClick$?: QRL<() => unknown>;
  loading?: boolean;
}
type ButtonProp = PropsOf<"button">;
type DivProp = PropsOf<"div">;

export const Button = component$<ButtonProps>(
  ({
    class: className,
    onClick$,
    look,
    rounded,
    size,
    asChild = false,
    ...props
  }) => {
    const loading = useSignal<boolean>(false);
    return asChild ? (
      <div
        class={cn(buttonVariants({ look, size, rounded, className }))}
        onClick$={
          onClick$ &&
          $(async () => {
            loading.value = true;
            await onClick$();
            loading.value = false;
          })
        }
        {...(props as DivProp)}
      >
        <Slot />
      </div>
    ) : (
      <button
        class={cn(buttonVariants({ look, size, rounded, className }))}
        onClick$={
          onClick$ &&
          $(async () => {
            loading.value = true;
            await onClick$();
            loading.value = false;
          })
        }
        {...(props as ButtonProp)}
      >
        <div
          class={cn(
            "transition-[opacity,transform,visibility] duration-200",
            loading.value || props.loading
              ? "invisible translate-x-5 opacity-0"
              : "visible delay-300",
          )}
        >
          <Slot />
        </div>
        <div
          class={cn(
            "absolute duration-200",
            loading.value || props.loading
              ? "visible delay-300"
              : "invisible -translate-x-5 opacity-0",
          )}
        >
          <LuLoader2 class="h-5 w-5 animate-spin" />
        </div>
      </button>
    );
  },
);
