import { component$, Slot } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@builder.io/qwik-city";

const appBarVariants = cva(
  [
    "left-0 right-0 box-border z-[12]",
    "bg-surface text-on-surface",
    "transition-all duration-medium-4 ease-standard",
  ],
  {
    variants: {
      position: {
        top: "top-0",
        bottom: "bottom-0",
      },
      variant: {
        small: [
          "h-16",
          "px-4",
          "shadow-elevation-0 hover:shadow-elevation-2",
          "grid grid-cols-[max-content_1fr_max-content] items-center gap-4",
        ],
        center: [
          "h-16",
          "px-4",
          "shadow-elevation-0 hover:shadow-elevation-2",
          "grid grid-cols-[max-content_1fr_max-content] items-center gap-4",
        ],
        medium: [
          "h-28",
          "px-4 pt-6 pb-4",
          "shadow-elevation-0 hover:shadow-elevation-2",
          "grid grid-rows-[auto_auto] grid-cols-[max-content_1fr_max-content]",
          "gap-y-2 gap-x-4",
        ],
        large: [
          "h-38",
          "px-4 pt-6 pb-8",
          "shadow-elevation-0 hover:shadow-elevation-2",
          "grid grid-rows-[auto_auto] grid-cols-[max-content_1fr_max-content]",
          "gap-y-4 gap-x-4",
        ],
        bottom: [
          "h-20",
          "px-4 py-2",
          "shadow-elevation-2",
          "rounded-t-2xl",
          "grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))]",
          "justify-items-center items-center gap-2",
        ],
        bottomFab: [
          "h-20",
          "px-4 py-2",
          "shadow-elevation-2",
          "rounded-t-2xl",
          "grid grid-cols-[max-content_1fr_max-content] items-center gap-4",
          "relative",
        ],
      },
      scrollBehavior: {
        standard: "",
        elevated: ["bg-surface-container", "shadow-elevation-2"],
        sticky: ["bg-surface-container-low", "shadow-elevation-0"],
      },
    },
    defaultVariants: {
      position: "top",
      variant: "small",
      scrollBehavior: "standard",
    },
  },
);

const titleVariants = cva("text-on-surface truncate", {
  variants: {
    variant: {
      small: "text-title-large col-start-2",
      medium: "text-headline-small col-start-2 row-start-2",
      large: "text-headline-medium col-start-2 row-start-2",
      center: "text-title-large col-start-2 text-center",
      bottom: "text-title-large",
      bottomFab: "text-title-large",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

export interface AppBarProps extends VariantProps<typeof appBarVariants> {
  class?: string;
  skipToContent?: boolean;
}

export const AppBar = component$<AppBarProps>(
  ({ variant, scrollBehavior, class: className, skipToContent, ...props }) => {
    if (variant === "bottom" || variant === "bottomFab") {
      return (
        <footer
          class={appBarVariants({
            position: "bottom",
            variant,
            scrollBehavior,
            class: className,
          })}
          {...props}
        >
          {variant === "bottomFab" ? (
            <>
              <Slot name="leading" />
              <div class="absolute left-1/2 -translate-x-1/2 -translate-y-8">
                <Slot name="fab" />
              </div>
              <Slot name="trailing" />
            </>
          ) : (
            <Slot />
          )}
        </footer>
      );
    }

    return (
      <header
        class={appBarVariants({
          position: "top",
          variant,
          scrollBehavior,
          class: className,
        })}
        {...props}
      >
        <Slot name="leading" />

        <div class={titleVariants({ variant })}>
          <Slot name="title" />
        </div>

        {skipToContent && (
          <Link
            id="skip-to-main"
            href="#main-content"
            class="pointer-events-none absolute rounded-md bg-inverse-surface p-2 text-inverse-on-surface opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100"
          >
            Skip to main content
          </Link>
        )}

        <Slot name="trailing" />
        <Slot />
      </header>
    );
  },
);
