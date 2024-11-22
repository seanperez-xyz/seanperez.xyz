import { QRL } from "@builder.io/qwik";

export interface FocusRingProps {
    /**
     * Makes the focus ring visible.
     */
    visible?: boolean;

    /**
     * Makes the focus ring animate inwards instead of outwards.
     */
    inward?: boolean;

    /**
     * The element to attach the focus ring to
     */
    control?: HTMLElement;

    /**
     * Callback fired when visibility changes
     */
    onVisibleChange$?: QRL<(visible: boolean) => void>;
} 