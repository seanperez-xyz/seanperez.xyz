import type { SliderProps } from "~/components/slider";
import { Slider } from "~/components/slider";

import { hctFromHex, hexFromHct } from "./utils/color-helpers";
import type { Signal } from "@builder.io/qwik";
import { $, component$, useComputed$ } from "@builder.io/qwik";
import { useBoundSignal } from "~/utils";

/**
 * A tuple denoting an inclusive value range.
 */
type Range = [number, number];

const HUE_RANGE: Range = [0, 360];
const CHROMA_RANGE: Range = [0, 150];
const TONE_RANGE: Range = [0, 100];

/**
 * A slider for either hue, chroma, or tone with a preview gradient.
 *
 * @event input Fired when the user changes the value.
 */
// @customElement("hct-slider")
export interface HCTSliderProps extends SliderProps {
  label?: string;
  color: string;
  "bind:color"?: Signal<string | undefined>;
  type: "hue" | "chroma" | "tone";
}

export const HCTSlider = component$<HCTSliderProps>(
  ({
    label = "",
    value: valueProp = 0,
    "bind:value": givenSignal,
    color: colorProp = "",
    "bind:color": givenColor,
    type = "hue",
    ...sliderProps
  }) => {
    const valueSignal = useBoundSignal(givenSignal, String(valueProp));
    const colorSignal = useBoundSignal(givenColor, colorProp);

    const range = useComputed$(() =>
      type === "hue"
        ? HUE_RANGE
        : type === "chroma"
          ? CHROMA_RANGE
          : TONE_RANGE,
    );

    const handleInput = $((value: number | [number, number]) => {
      if (typeof value === "number") {
        valueSignal.value = String(value);
      }
    });

    const buildGradient = useComputed$(() => {
      const numStops = 100;
      let linearGradientString = "linear-gradient(to right";

      if (type === "hue") {
        for (let i = 0; i < numStops; i++) {
          const hue = (HUE_RANGE[1] / numStops) * i;
          const hex = hexFromHct(hue, 100, 50);
          linearGradientString += `, ${hex} ${i}%`;
        }
      } else if (type === "chroma") {
        const hct = hctFromHex(colorSignal.value || "#000");
        const hue = hct.hue;
        for (let i = 0; i < numStops; i++) {
          const chroma = (CHROMA_RANGE[1] / numStops) * i;
          // Change the color of the bar to the current hue and set the tone to
          // mid so we it's not too dark or too bright and vary the chroma
          const hex = hexFromHct(hue, chroma, 50);
          linearGradientString += `, ${hex} ${i}%`;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (type === "tone") {
        for (let i = 0; i < numStops; i++) {
          const tone = (TONE_RANGE[1] / numStops) * i;
          // Set tone color to black (0 chroma means that hue doesn't matter) and
          // vary the tone
          const hex = hexFromHct(0, 0, tone);
          linearGradientString += `, ${hex} ${i}%`;
        }
      }

      linearGradientString += ")";
      return linearGradientString;
    });

    return (
      <div class="flex flex-col">
        {label && (
          <span class="mb-2 text-label-medium text-on-surface">{label}</span>
        )}
        <Slider
          {...sliderProps}
          labeled
          aria-label={label}
          min={range.value[0]}
          max={range.value[1]}
          value={Number(valueSignal.value)}
          bind:value={valueSignal}
          onInput$={handleInput}
        />
        <div
          class={[
            "mt-2 h-6 rounded-full border border-outline",
            type === "chroma" && "will-change-[background]",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            background: buildGradient.value,
          }}
        />
      </div>
    );
  },
);
