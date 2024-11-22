import type { QRL, Signal } from "@builder.io/qwik";
//
import type {
    Direction,
    Orientation,
} from "./segmented-button-context";

export type SegmentedButtonSetBaseProps = {
    /**
     * When true, prevents the user from interacting with the toggle group and all its items.
     */
    disabled?: boolean;
};

export type SegmentedButtonSetNavigationProps = {
    /**
     * The orientation of the component, which determines how focus moves:
     * horizontal for left/right arrows and vertical for up/down arrows.
     * Default to (left-to-right) reading mode.
     */
    orientation?: Orientation;
    /**
     * The reading direction of the toggle group.
     * Default to (left-to-right) reading mode.
     */
    direction?: Direction;
    /**
     * When true
     * keyboard navigation will loop from last item to first, and vice versa.
     */
    loop?: boolean;
};

export type SegmentedButtonSetSingleProps = {
    /**
     * Determines if multi selection is enabled.
     */
    multiple?: false;
    /**
     * The initial value of the pressed item (uncontrolled).
     * Can be used in conjunction with onChange$.
     */
    value?: string;

    /**
     * The callback that fires when the value of the toggle group changes.
     * Event handler called when the pressed state of an item changes.
     */
    onChange$?: QRL<(value: string) => void>;
    /**
     * The reactive value (a signal) of the pressed item (the signal is the controlled value).
     * Controlling the pressed state with a bounded value.
     */
    "bind:value"?: Signal<string>;
};

export type SegmentedButtonSetMultipleProps = {
    /**
     * Determines if multi selection is enabled.
     */
    multiple?: true;
    /**
     * The initial value of the pressed item (uncontrolled).
     * Can be used in conjunction with onChange$.
     */
    value?: string[];
    /**
     * The callback that fires when the value of the toggle group changes.
     * Event handler called when the pressed state of an item changes.
     */
    onChange$?: QRL<(value: string[]) => void>;
    /**
     * The reactive value (a signal) of the pressed item (the signal is the controlled value).
     * Controlling the pressed state with a bounded value.
     */
    "bind:value"?: Signal<string[]>;
};

export type SegmentedButtonSetApiProps = (
    | SegmentedButtonSetSingleProps
    | SegmentedButtonSetMultipleProps
) &
    SegmentedButtonSetBaseProps &
    SegmentedButtonSetNavigationProps;
