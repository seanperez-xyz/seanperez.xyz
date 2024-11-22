import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import type { QRL, Signal } from "@builder.io/qwik";
import { useBoundSignal } from "~/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  "bind:value"?: Signal<string | undefined>;
  "bind:startValue"?: Signal<string | undefined>;
  valueStart?: number;
  valueEnd?: number;
  valueLabel?: string;
  valueLabelStart?: string;
  valueLabelEnd?: string;
  disabled?: boolean;
  range?: boolean;
  ticks?: boolean;
  labeled?: boolean;
  name?: string;
  nameStart?: string;
  nameEnd?: string;
  ariaLabel?: string;
  ariaLabelStart?: string;
  ariaLabelEnd?: string;
  ariaValueText?: string;
  ariaValueTextStart?: string;
  ariaValueTextEnd?: string;
  onInput?: QRL<(value: number | [number, number]) => void>;
}

export const Slider = component$<SliderProps>((props) => {
  const {
    min = 0,
    max = 100,
    step = 1,
    value,
    "bind:value": givenSignal,
    "bind:startValue": givenStartSignal,
    valueStart,
    valueEnd,
    valueLabel = "",
    valueLabelStart = "",
    valueLabelEnd = "",
    disabled = false,
    range = false,
    ticks = false,
    labeled = false,
    name,
    nameStart = name,
    nameEnd = name,
    ariaLabel,
    ariaLabelStart,
    ariaLabelEnd,
    ariaValueText,
    ariaValueTextStart,
    ariaValueTextEnd,
    onInput$,
  } = props;

  // State signals
  const isRedispatchingEvent = useSignal(false);
  const handlesOverlapping = useSignal(false);
  const renderValueStart = useBoundSignal(
    givenStartSignal,
    String(valueStart ?? min),
  );
  const renderValueEnd = useBoundSignal(
    givenSignal,
    String(range ? (valueEnd ?? max) : (value ?? min)),
  );

  // Calculate fractions for positioning
  const startFraction = useSignal(0);
  const endFraction = useSignal(0);

  // Update fractions when values change
  useTask$(({ track }) => {
    track(() => [renderValueStart.value, renderValueEnd.value]);
    const totalRange = Math.max(max - min, step);
    const endValue = Number(renderValueEnd.value ?? min);
    startFraction.value =
      ((Number(renderValueStart.value) - min) / totalRange) * 100;
    endFraction.value = ((endValue - min) / totalRange) * 100;
  });

  // Add these signals at the top of the component
  const isDragging = useSignal(false);
  const activeHandle = useSignal<"start" | "end" | null>(null);

  // Update the handleDrag function to use the parent slider element for measurements
  const handleDrag = $((event: PointerEvent) => {
    if (!isDragging.value || !activeHandle.value) return;

    // Find the slider track element (parent of the handle)
    const sliderElement = (event.target as HTMLElement).closest(
      ".group",
    ) as HTMLElement;
    if (!sliderElement) return;

    const rect = sliderElement.getBoundingClientRect();
    const position = event.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, position / rect.width));
    const value = min + fraction * (max - min);
    const roundedValue = Math.round(value / step) * step;

    if (activeHandle.value === "start") {
      const newValue = Math.max(
        min,
        Math.min(Number(renderValueEnd.value), roundedValue),
      );
      renderValueStart.value = String(newValue);
    } else {
      const newValue = Math.max(
        range ? Number(renderValueStart.value) : min,
        Math.min(max, roundedValue),
      );
      renderValueEnd.value = String(newValue);
    }

    if (onInput$) {
      onInput$(
        range
          ? [Number(renderValueStart.value), Number(renderValueEnd.value)]
          : Number(renderValueEnd.value),
      );
    }
  });

  // Add the handleInput function back for keyboard and click events
  const handleInput = $(
    (event: InputEvent, input: HTMLInputElement, handle: "start" | "end") => {
      if (isRedispatchingEvent.value) return;

      const numValue = Number(input.value);

      // For keyboard events
      if (!(event instanceof PointerEvent)) {
        if (handle === "start") {
          if (numValue > Number(renderValueEnd.value)) {
            renderValueStart.value = renderValueEnd.value;
          } else {
            renderValueStart.value = String(numValue);
          }
        } else {
          if (range && numValue < Number(renderValueStart.value)) {
            renderValueEnd.value = String(renderValueStart.value);
          } else {
            renderValueEnd.value = input.value;
          }
        }

        // Emit input event
        if (onInput$) {
          onInput$(
            range
              ? [Number(renderValueStart.value), Number(renderValueEnd.value)]
              : Number(renderValueEnd.value),
          );
        }
        return;
      }

      // For pointer events on the track (not the handle)
      if (!isDragging.value) {
        const rect = input.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const fraction = clickX / rect.width;
        const value = min + fraction * (max - min);
        const roundedValue = Math.round(value / step) * step;

        if (handle === "start") {
          const newValue = Math.max(
            min,
            Math.min(Number(renderValueEnd.value), roundedValue),
          );
          renderValueStart.value = String(newValue);
        } else {
          const newValue = Math.max(
            range ? Number(renderValueStart.value) : min,
            Math.min(max, roundedValue),
          );
          renderValueEnd.value = String(newValue);
        }

        // Emit input event
        if (onInput$) {
          onInput$(
            range
              ? [Number(renderValueStart.value), Number(renderValueEnd.value)]
              : Number(renderValueEnd.value),
          );
        }
      }
    },
  );

  // Update overlapping state
  useTask$(({ track }) => {
    track(renderValueStart);
    const endValue = track(renderValueEnd);
    if (!range) return;

    const diff = Math.abs(Number(renderValueStart.value) - Number(endValue));
    handlesOverlapping.value = diff < step;
  });

  return (
    <div
      class={[
        "min-w-50 group relative flex h-20 w-full items-center",
        "aria-disabled:opacity-38",
        "border-2 border-red-300",
      ]}
      style={{
        "--_start-fraction": startFraction.value / 100,
        "--_end-fraction": endFraction.value / 100,
      }}
      aria-disabled={disabled}
    >
      {/* Track */}
      <div class="absolute z-1 h-[4px] w-full rounded-full bg-surface-container-highest forced-colors:bg-[Canvas]">
        {/* Active track */}
        <div
          class={[
            "absolute h-full rounded-full bg-primary transition-[background] duration-medium-1",
            "forced-colors:bg-[CanvasText]",
          ]}
          style={{
            left: `${range ? startFraction.value : 0}%`,
            right: `${100 - endFraction.value}%`,
          }}
        />

        {/* Tick marks if enabled */}
        {ticks && (
          <div class="absolute h-full w-full">
            {Array.from({ length: (max - min) / step + 1 }).map((_, i) => (
              <div
                key={i}
                class={[
                  "absolute h-0.5 w-0.5 -translate-x-1/2 rounded-full",
                  i * step >= Number(renderValueStart.value) &&
                  i * step <= Number(renderValueEnd.value)
                    ? "bg-on-primary forced-colors:bg-[Canvas]"
                    : "bg-surface-variant forced-colors:bg-[CanvasText]",
                ]}
                style={{
                  left: `${(i * step * 100) / (max - min)}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Range start input */}
      {range && (
        <div class="group/start ranged">
          <input
            type="range"
            class={[
              "peer/start start absolute inset-0 cursor-pointer appearance-none bg-transparent focus:outline-none",
              "[&::-moz-range-thumb]:invisible [&::-webkit-slider-thumb]:invisible",
              "z-20",
            ]}
            min={min}
            max={max}
            step={step}
            value={renderValueStart.value}
            disabled={disabled}
            aria-label={ariaLabelStart || `${ariaLabel} start`}
            aria-valuetext={
              ariaValueTextStart ||
              valueLabelStart ||
              String(renderValueStart.value)
            }
            name={nameStart}
            onInput$={(e, el) => handleInput(e, el, "start")}
          />
          <div
            class={[
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "h-5 w-5 cursor-pointer rounded-full outline-none",
              "bg-primary shadow-elevation-1",
              "z-20",
              "group-hover/start:shadow-elevation-2",
              "peer-focus-visible/start:outline peer-focus-visible/start:outline-3 peer-focus-visible/start:outline-offset-8 peer-focus-visible/start:outline-primary",
              "peer-focus-visible/start:animate-[outline-in_250ms_cubic-bezier(0.4,0,0.2,1)]",
              "peer-focus-not-visible/start:shadow-elevation-2",
              "forced-colors:bg-[CanvasText] forced-colors:shadow-none",
              "peer-focus-visible/start:forced-colors:outline-[CanvasText]",
              handlesOverlapping.value &&
                "ring-1 ring-white ring-offset-4 forced-colors:ring-[CanvasText]",
              "before:absolute before:-inset-3 before:rounded-full before:bg-primary before:opacity-0",
              "group-hover/start:before:opacity-8",
              "group-active/start:before:opacity-12",
              "before:transition-opacity before:duration-short-2",
            ]}
            style={{
              left: `${startFraction.value}%`,
            }}
            onPointerDown$={(e) => {
              isDragging.value = true;
              activeHandle.value = "start";
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              document.addEventListener("pointermove", (e) => handleDrag(e));
              document.addEventListener(
                "pointerup",
                () => {
                  isDragging.value = false;
                  activeHandle.value = null;
                  document.removeEventListener("pointermove", handleDrag);
                },
                { once: true },
              );
            }}
          >
            {labeled && (
              <div
                class={[
                  "absolute bottom-12 left-1/2 -translate-x-1/2",
                  "min-h-7 min-w-7 rounded-full bg-primary text-label-medium text-on-primary",
                  "box-border flex items-center justify-center",
                  "select-none",
                  "px-4 py-2",
                  "origin-bottom scale-0 opacity-0",
                  "group-hover/start:scale-100 group-hover/start:opacity-100",
                  "group-focus-within/start:scale-100 group-focus-within/start:opacity-100",
                  "transition-[transform,opacity] duration-short-2 ease-standard",
                  handlesOverlapping.value &&
                    "outline outline-1 outline-white forced-colors:outline-[CanvasText]",
                  "relative",
                  "before:absolute before:bg-primary before:content-['']",
                  "before:h-4 before:w-4",
                  "before:-bottom-[3px]",
                  "before:left-1/2 before:-translate-x-1/2 before:rotate-45",
                  "before:-z-1",
                  "after:absolute after:inset-0 after:rounded-full after:bg-primary",
                  "after:-z-[2]",
                ]}
              >
                {valueLabelStart || renderValueStart.value}
              </div>
            )}
          </div>
        </div>
      )}

      {/* End handle input */}
      <div class={["group/end", range && "ranged"]}>
        <input
          type="range"
          class={[
            "peer/end end absolute inset-0 cursor-pointer appearance-none bg-transparent focus:outline-none",
            "[&::-moz-range-thumb]:invisible [&::-webkit-slider-thumb]:invisible",
            "z-20",
          ]}
          min={min}
          max={max}
          step={step}
          value={renderValueEnd.value}
          bind:value={renderValueEnd}
          disabled={disabled}
          aria-label={range ? ariaLabelEnd || `${ariaLabel} end` : ariaLabel}
          aria-valuetext={
            range
              ? ariaValueTextEnd ||
                valueLabelEnd ||
                String(renderValueEnd.value)
              : ariaValueText || valueLabel || String(renderValueEnd.value)
          }
          name={range ? nameEnd : name}
          onInput$={(e, el) => handleInput(e, el, "end")}
        />
        <div
          class={[
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "h-5 w-5 cursor-pointer rounded-full outline-none",
            "bg-primary shadow-elevation-1",
            "z-20",
            "group-hover/end:shadow-elevation-2",
            "peer-focus-visible/end:outline peer-focus-visible/end:outline-3 peer-focus-visible/end:outline-offset-8 peer-focus-visible/end:outline-primary",
            "peer-focus-visible/end:animate-[outline-in_250ms_cubic-bezier(0.4,0,0.2,1)]",
            "peer-focus-not-visible/end:shadow-elevation-2",
            "forced-colors:bg-[CanvasText] forced-colors:shadow-none",
            "peer-focus-visible/end:forced-colors:outline-[CanvasText]",
            handlesOverlapping.value &&
              "ring-1 ring-white ring-offset-4 forced-colors:ring-[CanvasText]",
            "before:absolute before:-inset-3 before:rounded-full before:bg-primary before:opacity-0",
            "group-hover/end:before:opacity-8",
            "group-active/end:before:opacity-12",
            "before:transition-opacity before:duration-short-2",
          ]}
          style={{
            left: `${endFraction.value}%`,
          }}
          onPointerDown$={(e) => {
            isDragging.value = true;
            activeHandle.value = "end";
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            document.addEventListener("pointermove", (e) => handleDrag(e));
            document.addEventListener(
              "pointerup",
              () => {
                isDragging.value = false;
                activeHandle.value = null;
                document.removeEventListener("pointermove", handleDrag);
              },
              { once: true },
            );
          }}
        >
          {labeled && (
            <div
              class={[
                "absolute bottom-12 left-1/2 -translate-x-1/2",
                "min-h-7 min-w-7 rounded-full bg-primary text-label-medium text-on-primary",
                "box-border flex items-center justify-center",
                "select-none",
                "px-4 py-2",
                "origin-bottom scale-0 opacity-0",
                "group-hover/end:scale-100 group-hover/end:opacity-100",
                "group-focus-within/end:scale-100 group-focus-within/end:opacity-100",
                "transition-[transform,opacity] duration-short-2 ease-standard",
                handlesOverlapping.value &&
                  "outline outline-1 outline-white forced-colors:outline-[CanvasText]",
                "relative",
                "before:absolute before:bg-primary before:content-['']",
                "before:h-4 before:w-4",
                "before:-bottom-[0.188rem]",
                "before:left-1/2 before:-translate-x-1/2 before:rotate-45",
                "before:-z-1",
                "after:absolute after:inset-0 after:rounded-full after:bg-primary",
                "after:-z-[2]",
              ]}
            >
              {range
                ? valueLabelEnd || renderValueEnd.value
                : valueLabel || renderValueEnd.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
