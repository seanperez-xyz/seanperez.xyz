import type { QRL } from "@builder.io/qwik";

export interface SelectProps {
    /**
    * Opens the menu synchronously with no animation.
    */
    quick: boolean;

    /**
    * Whether or not the select is required.
    */
    required: boolean;

    /**
    * The error message that replaces supporting text when `error` is true. If
    * `errorText` is an empty string, then the supporting text will continue to
    * show.
    *
    * This error message overrides the error message displayed by
    * `reportValidity()`.
    */
    errorText?: string;

    /**
    * The floating label for the field.
    */
    label?: string;

    /**
    * Disables the asterisk on the floating label, when the select is
    * required.
    */
    noAsterisk?: boolean;

    /**
    * Conveys additional information below the select, such as how it should
    * be used.
    */
    supportingText?: string;

    /**
    * Gets or sets whether or not the select is in a visually invalid state.
    *
    * This error state overrides the error state controlled by
    * `reportValidity()`.
    */
    error?: boolean;

    /**
    * Whether or not the underlying md-menu should be position: fixed to display
    * in a top-level manner, or position: absolute.
    *
    * position:fixed is useful for cases where select is inside of another
    * element with stacking context and hidden overflows such as `md-dialog`.
    */
    menuPositioning: 'absolute' | 'fixed' | 'popover';

    /**
    * Clamps the menu-width to the width of the select.
    */
    clampMenuWidth: boolean;

    /**
    * The max time between keystrokes for typeahead
    */
    typeaheadDelay?: number;

    /**
    * Whether or not the text field has a leading icon. Used for SSR.
    */
    hasLeadingIcon: boolean;

    /**
    * Text to display in the field. Only set for SSR.
    */
    displayText: string;

    /**
    * Whether the menu should be aligned to the start or the end of the select's
    * text-box.
    */
    menuAlign: 'start' | 'end';

    /**
    * The value of the currently selected option.
    */
    getValue: QRL<() => string>

    setValue: QRL<(value: string) => void>

    value: string;

    getOptions: QRL<() => []>
    /**
    * The index of the currently selected option.
    */
    getSelectedIndex: QRL<() => number>

    setSelectedIndex: QRL<(index: number) => void>
}