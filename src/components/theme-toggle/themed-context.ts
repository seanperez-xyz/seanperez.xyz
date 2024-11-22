import { createContextId } from "@builder.io/qwik";
import type { ThemeMode } from "./themed.types";

export interface ThemedContextValue {
    /**
     * The currently selected color mode.
     */
    selectedColorMode: ThemeMode | null;

    /**
     * The currently selected hex color.
     *
     * NOTE: Hex colors are in the srgb color space and HCT has a much larger, so
     * this value is a clipped value of HCT.
     */
    hexColor: string;

    /**
     * The current hue value of the hue slider.
     */
    hue: number;

    /**
     * The current value of the chroma slider.
     */
    chroma: number;

    /**
     * The current value of the tone slider.
     */
    tone: number;
}

export const ThemedContext = createContextId<ThemedContextValue>("themed-context");
