import type { PropsOf, Signal } from "@builder.io/qwik";

export interface SliderState {
    handleStartHover: boolean;
    handleEndHover: boolean;
    startOnTop: boolean;
    handlesOverlapping: boolean;
    renderValueStart?: number;
    renderValueEnd?: number;
}

export interface SliderContextValue {
    disabled?: boolean
    range?: boolean
    ripplePointerId: Signal<number>
}
export interface SliderProps extends PropsOf<'input'> {

    /**
     * The slider minimum value
     */
    min: number;

    /**
     * The slider maximum value
     */
    max: number;

    /**
     * The slider value displayed when range is false.
     */
    value?: number;

    /**
     * The slider start value displayed when range is true.
     */
    valueStart?: number;

    /**
     * The slider end value displayed when range is true.
     */
    valueEnd?: number;

    /**
     * An optional label for the slider's value displayed when range is
     * false; if not set, the label is the value itself.
     */
    valueLabel: string;

    /**
     * An optional label for the slider's start value displayed when
     * range is true; if not set, the label is the valueStart itself.
     */
    valueLabelStart?: string;

    /**
     * An optional label for the slider's end value displayed when
     * range is true; if not set, the label is the valueEnd itself.
     */

    valueLabelEnd?: string;

    /**
     * Aria label for the slider's start handle displayed when
     * range is true.
     */
    ariaLabelStart?: string;

    /**
     * Aria value text for the slider's start value displayed when
     * range is true.
     */
    ariaValueTextStart?: string;

    /**
     * Aria label for the slider's end handle displayed when
     * range is true.
     */
    ariaLabelEnd: string;

    /**
     * Aria value text for the slider's end value displayed when
     * range is true.
     */
    ariaValueTextEnd?: string;

    /**
     * The step between values.
     */
    step?: number;

    /**
     * Whether or not to show tick marks.
     */

    ticks?: boolean;

    /**
     * Whether or not to show a value label when activated.
     */
    labeled?: boolean;

    /**
     * Whether or not to show a value range. When false, the slider displays
     * a slidable handle for the value property; when true, it displays
     * slidable handles for the valueStart and valueEnd properties.
     */
    range?: boolean;
    name?: string;

}