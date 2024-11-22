import type { Signal } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";
//
import type { RippleState } from "./ripple.types";

export const RippleContext = createContextId<RippleContextValue>('ripple.context')

export type RippleContextValue = {
    pressed: Signal<boolean>;
    activeId: number;
    state: RippleState;
    growAnimation: Signal<Animation | undefined>;

}