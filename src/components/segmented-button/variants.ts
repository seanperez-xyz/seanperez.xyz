import { cva } from "class-variance-authority";

export const segmentedButtonVariants = cva(
    [
        "relative flex items-center justify-center",
        "outline-none text-label-large",
        "h-10 min-w-12",
        "flex-1",
        "bg-transparent",
        "-webkit-tap-highlight-color-transparent",
        "cursor-pointer disabled:cursor-default",
        "text-label-large font-medium",
        "text-on-surface",
        "hover:bg-on-surface/8",
        "active:bg-on-surface/12",
        "disabled:opacity-38 disabled:pointer-events-none",
        "aria-pressed:bg-secondary-container",
        "aria-pressed:text-on-secondary-container",
        "aria-pressed:hover:bg-secondary-container/92",
        "aria-pressed:active:bg-secondary-container/88",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        "transition-colors duration-medium-2 ease-standard",
        "relative after:absolute after:inset-0 after:-mx-3 after:-my-4 after:rounded-full",
        "[&>div]:transition-all [&>div]:duration-medium-2 [&>div]:ease-standard",
    ],
    {
        variants: {
            hasIcon: {
                true: "px-3",
                false: "px-6",
            },
        },
        defaultVariants: {
            hasIcon: true,
        },
    },
);

export const segmentedButtonSetVariants = cva(
    [
        "flex items-stretch",
        "w-full border border-outline rounded-full",
        "bg-surface-container-low text-on-surface",
        "overflow-hidden",
        "[&>*:first-child]:border-0",
        "[&>*+*]:border-l [&>*+*]:border-outline",
        "aria-disabled:pointer-events-none aria-disabled:opacity-38",
        "transition-all duration-medium-2 ease-standard",
    ],
    {
        variants: {
            orientation: {
                horizontal: "flex-row",
                vertical: [
                    "flex-col",
                    "[&>*+*]:border-l-0",
                    "[&>*+*]:border-t",
                    "[&>*+*]:border-outline/12",
                ],
            },
        },
        defaultVariants: {
            orientation: "horizontal",
        },
    },
);