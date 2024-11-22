import { isServer } from "@builder.io/qwik/build";



export const PRESS_GROW_MS = 450;
export const MINIMUM_PRESS_MS = 225;
export const INITIAL_ORIGIN_SCALE = 0.2;
export const PADDING = 10;
export const SOFT_EDGE_MINIMUM_SIZE = 75;
export const SOFT_EDGE_CONTAINER_RATIO = 0.35;
export const PRESS_PSEUDO = '::after';
export const ANIMATION_FILL = 'forwards';

export const TOUCH_DELAY_MS = 150;

/**
 * Interaction states for the ripple.
 *
 * On Touch:
 *  - `INACTIVE -> TOUCH_DELAY -> WAITING_FOR_CLICK -> INACTIVE`
 *  - `INACTIVE -> TOUCH_DELAY -> HOLDING -> WAITING_FOR_CLICK -> INACTIVE`
 *
 * On Mouse or Pen:
 *   - `INACTIVE -> WAITING_FOR_CLICK -> INACTIVE`
 */
export enum State {
    /**
     * Initial state of the control, no touch in progress.
     */
    INACTIVE,

    /**
     * Touch down has been received, waiting to determine if it's a swipe or scroll.
     */
    TOUCH_DELAY,

    /**
     * A touch has been deemed to be a press
     */
    HOLDING,

    /**
     * The user touch has finished, transition into rest state.
     */
    WAITING_FOR_CLICK,
}

/**
 * Events that the ripple listens to.
 */
export const EVENTS = [
    "click",
    "contextmenu",
    "pointercancel",
    "pointerdown",
    "pointerenter",
    "pointerleave",
    "pointerup",
];

/**
 * Used to detect if HCM is active. Events do not process during HCM when the
 * ripple is not displayed.
 */
export const FORCED_COLORS = isServer
    ? null
    : window.matchMedia('(forced-colors: active)');

