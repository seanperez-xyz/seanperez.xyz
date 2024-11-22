import type { PropsOf, Signal } from "@builder.io/qwik";

export interface RippleProps extends PropsOf<"span"> {
    /**
     * Disables the ripple.
     */
    disabled?: boolean;

    /**
     * Shows the ripple as a circle rather than a rectangle that matches the parent's border radius.
     */
    unbounded?: boolean;

    /**
     * Centers the ripple instead of starting from click position.
     */
    centered?: boolean;

    /**
     * The element to attach the ripple to.
     */
    control?: HTMLElement;

    /**
     * A signal containing the element to attach the ripple to.
     */
    for?: Signal<HTMLElement | undefined>;
}

export interface RippleState {
    id: number | null;
    x: number | null;
    y: number | null;
    size: number | null;
    scale: number | null;
    initialSize: number
}
