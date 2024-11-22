import {
  $,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
  useOn,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
//
import { Elevation } from "~/components/elevation";
import { FocusRing } from "~/components/focus-ring";
import type { Ripple } from "~/components/ripple";
import type {
  SliderContextValue,
  SliderProps,
  SliderState,
} from "./slider.types";
import {
  isActivationClick,
  dispatchActivationClick,
  redispatchEvent,
} from "@material/web/events";

export const SliderContext =
  createContextId<SliderContextValue>("slider.context");
export const Slider = component$<SliderProps>(
  ({
    min = 0,
    max = 100,
    value,
    valueStart,
    valueEnd,
    valueLabel = "",
    valueLabelStart = "",
    valueLabelEnd = "",
    ariaLabelStart = "",
    ariaValueTextStart = "",
    ariaLabelEnd = "",
    ariaValueTextEnd = "",
    step = 1,
    ticks = false,
    labeled = false,
    range = false,
    name,
    disabled,
    "aria-label": ariaLabel,
    "aria-valuetext": ariaValueText,
    ...props
  }) => {
    /**
     * The HTML name to use in form submission for a range slider's starting
     * value. Use `name` instead if both the start and end values should use the
     * same name.
     */
    // get nameStart() {
    //   return this.getAttribute('name-start') ?? this.name;
    // }
    // set nameStart(name: string) {
    //   this.setAttribute('name-start', name);
    // }

    /**
     * The HTML name to use in form submission for a range slider's ending value.
     * Use `name` instead if both the start and end values should use the same
     * name.
     */
    // get nameEnd() {
    //   return this.getAttribute('name-end') ?? this.nameStart;
    // }
    // set nameEnd(name: string) {
    //   this.setAttribute('name-end', name);
    // }

    const inputStart = useSignal<HTMLInputElement>();
    const handleStart = useSignal<HTMLDivElement>();
    const rippleStart = useSignal<MdRipple>();
    const inputEnd = useSignal<HTMLInputElement>();
    const handleEnd = useSignal<HTMLDivElement>();
    const rippleEnd = useSignal<MdRipple>();

    // handle hover/pressed states are set manually since the handle
    // does not receive pointer events so that the native inputs are
    // interaction targets.
    const state = useStore<SliderState>({
      handleStartHover: false,
      handleEndHover: false,
      startOnTop: false,
      handlesOverlapping: false,
    });
    // Note: start aria-* properties are only applied when range=true, which is
    // why they do not need to handle both cases.
    const renderAriaLabelStart = useComputed$(
      () =>
        ariaLabelStart ||
        (ariaLabel && `${ariaLabel} start`) ||
        valueLabelStart ||
        String(valueStart),
    );

    const renderAriaValueTextStart = useComputed$(
      () => ariaValueTextStart || valueLabelStart || String(valueStart),
    );

    // Note: end aria-* properties are applied for single and range sliders, which
    // is why it needs to handle `this.range` (while start aria-* properties do
    // not).
    const renderAriaLabelEnd = useComputed$(() => {
      if (range) {
        return (
          ariaLabelEnd ||
          (ariaLabel && `${ariaLabel} end`) ||
          valueLabelEnd ||
          String(valueEnd)
        );
      }

      return ariaLabel || valueLabel || String(value);
    });

    const renderAriaValueTextEnd = useComputed$(() => {
      if (range) {
        return ariaValueTextEnd || valueLabelEnd || String(valueEnd);
      }

      return ariaValueText || valueLabel || String(value);
    });

    // used in synthetic events generated to control ripple hover state.
    const ripplePointerId = useSignal<number>(1);

    const action = useStore<Action>({
      canFlip: false,
      flipped: false,
      target,
      fixed,
      values: new Map(),
    });

    useOn(
      "click",
      $((event: PointerEvent) => {
        if (!isActivationClick(event) || !inputEnd.value) {
          return;
        }
        focus();
        dispatchActivationClick(inputEnd.value);
      }),
    );

    const focus = () => {
      inputEnd.value?.focus();
    };

    useTask$(({ track }) => {
      track(() => state.handleEndHover);
      track(() => state.handleStartHover);
      track(() => (valueStart ? valueStart : inputStart.value?.valueAsNumber));
      const endValueChanged = track(() => (valueEnd && range) || value);
      state.renderValueEnd = endValueChanged
        ? range
          ? valueEnd
          : value
        : inputEnd.value?.valueAsNumber;
      // manually handle ripple hover state since the handle is pointer events
      // none.
      if (state.handleStartHover !== undefined) {
        toggleRippleHover(rippleStart.value, state.handleStartHover);
      } else if (state.handleEndHover !== undefined) {
        toggleRippleHover(rippleEnd.value, state.handleEndHover);
      }
    });
    const isUpdatePending = useSignal<boolean>(false);

    useTask$(async ({ track }) => {
      track(() => range);
      track(() => state.renderValueStart);
      track(() => state.renderValueEnd);
      // Validate input rendered value and re-render if necessary. This ensures
      // the rendered handle stays in sync with the input thumb which is used for
      // interaction. These can get out of sync if a supplied value does not
      // map to an exactly stepped value between min and max.
      if (range) {
        state.renderValueStart = inputStart.value!.valueAsNumber;
      }
      state.renderValueEnd = inputEnd.value!.valueAsNumber;
      // update values if they are unset
      // when using a range, default to equi-distant between
      // min - valueStart - valueEnd - max
      if (range) {
        const segment = (max - min) / 3;
        if (valueStart === undefined) {
          inputStart.value!.valueAsNumber = min + segment;
          // read actual value from input
          const v = inputStart.value!.valueAsNumber;
          valueStart = state.renderValueStart = v;
        }
        if (valueEnd === undefined) {
          inputEnd.value!.valueAsNumber = min + 2 * segment;
          // read actual value from input
          const v = inputEnd.value!.valueAsNumber;
          valueEnd = state.renderValueEnd = v;
        }
      } else {
        value ??= state.renderValueEnd;
      }
      if (
        range ||
        state.renderValueStart ||
        state.renderValueEnd ||
        isUpdatePending.value
      ) {
        // Only check if the handle nubs are overlapping, as the ripple touch
        // target extends substantially beyond the boundary of the handle nub.
        const startNub = handleStart.value?.querySelector(".handleNub");
        const endNub = handleEnd.value?.querySelector(".handleNub");
        state.handlesOverlapping = await isOverlapping(startNub, endNub);
      }
      // called to finish the update immediately;
      // note, this is a no-op unless an update is scheduled
      // performUpdate();
    });

    const stepSig = useComputed$(() => (step === 0 ? 1 : step));
    const rangeSig = useComputed$(() => Math.max(max - min, stepSig.value));
    const startFraction = useComputed$(() =>
      range ? ((state.renderValueStart ?? min) - min) / rangeSig.value : 0,
    );
    const endFraction = useComputed$(
      () => ((state.renderValueEnd ?? min) - min) / rangeSig.value,
    );
    const containerStyles = {
      // for clipping inputs and active track.
      "--_start-fraction": String(startFraction.value),
      "--_end-fraction": String(endFraction.value),
      // for generating tick marks
      "--_tick-count": String(rangeSig.value / stepSig.value),
    };
    const containerClasses = { ranged: range };

    // optional label values to show in place of the value.
    const labelStart = valueLabelStart || String(state.renderValueStart);
    const labelEnd =
      (range ? valueLabelEnd : valueLabel) || String(state.renderValueEnd);

    const inputStartProps = {
      start: true,
      value: state.renderValueStart,
      ariaLabel: renderAriaLabelStart.value,
      ariaValueText: renderAriaValueTextStart,
      ariaMin: min,
      ariaMax: valueEnd ?? max,
      min,
      max,
    };

    const inputEndProps = {
      start: false,
      value: state.renderValueEnd,
      ariaLabel: renderAriaLabelEnd.value,
      ariaValueText: renderAriaValueTextEnd.value,
      ariaMin: range ? (valueStart ?? min) : min,
      ariaMax: max,
    };

    const handleStartProps = {
      start: true,
      hover: state.handleStartHover,
      label: labelStart,
    };

    const handleEndProps = {
      start: false,
      hover: state.handleEndHover,
      label: labelEnd,
    };

    const handleContainerClasses = {
      hover: state.handleStartHover || state.handleEndHover,
    };

    const context: SliderContextValue = {
      disabled,
      ripplePointerId,
    };
    const toggleRippleHover = $(
      async (ripple: Promise<Ripple | undefined>, hovering: boolean) => {
        const rippleEl = await ripple;
        if (!rippleEl) {
          return;
        }
        // TODO(b/269799771): improve slider ripple connection
        if (hovering) {
          rippleEl.handlePointerenter(
            new PointerEvent("pointerenter", {
              isPrimary: true,
              pointerId: ripplePointerId.value,
            }),
          );
        } else {
          rippleEl.handlePointerleave(
            new PointerEvent("pointerleave", {
              isPrimary: true,
              pointerId: ripplePointerId.value,
            }),
          );
        }
      },
    );

    useContextProvider<SliderContextValue>(SliderContext, context);

    return (
      <div class={["container", containerClasses]} style={containerStyles}>
        {range && <Input {...inputStartProps} />}
        <Input {...inputEndProps} /> <Track />
        <div class="handleContainerPadded">
          <div class="handleContainerBlock">
            <div class={["handleContainer", handleContainerClasses]}>
              {range && <Handle {...handleStartProps} />}
              <Handle {...handleEndProps} />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

const Track = component$<{ ticks?: number }>(({ ticks }) => {
  return (
    <>
      <div class="track" />
      {ticks && <div class="tickmarks" />}
    </>
  );
});

const Label = component$<{ value: string }>(({ value }) => {
  return (
    <div class="label" aria-hidden="true">
      <span class="labelContent">{value}</span>
    </div>
  );
});

const Handle = component$(
  ({
    start,
    hover,
    label,
  }: {
    start: boolean;
    hover: boolean;
    label: string;
  }) => {
    const { disabled } = useContext(SliderContext);
    const onTop = !disabled && start === startOnTop;
    const isOverlapping = !disabled && handlesOverlapping;
    const name = start ? "start" : "end";
    return (
      <div
        class={[
          "handle",
          {
            [name]: true,
            hover,
            onTop,
            isOverlapping,
          },
        ]}
      >
        <FocusRing for={name} />
        <Ripple for={name} class={name} disabled={disabled} />
        <div class="handleNub">
          <Elevation />
        </div>
        {label && <Label label={label} />}
      </div>
    );
  },
);

const Input = component$<{
  start: boolean;
  value?: number;
  ariaLabel: string;
  ariaValueText: string;
  ariaMin: number;
  ariaMax: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}>(
  ({
    start,
    value,
    ariaLabel,
    ariaValueText,
    ariaMin,
    ariaMax,
    disabled,
    min,
    max,
    step,
  }) => {
    const id = useId();

    // flag to prevent processing of re-dispatched input event.
    const isRedispatchingEvent = useSignal<boolean>(false);

    // Slider requires min/max set to the overall min/max for both inputs.
    // This is reported to screen readers, which is why we need aria-valuemin
    // and aria-valuemax.
    const name = start ? `start` : `end`;
    const ctx = useContext(SliderContext);
    const handleFocus = $((event: Event) => {
      updateOnTop(event.target as HTMLInputElement);
    });

    const startAction = $((event: Event) => {
      const target = event.target as HTMLInputElement;
      const fixed =
        target === inputStart.value ? inputEnd.value! : inputStart.value!;
      (action.canFlip = event.type === "pointerdown"),
        (action.flipped = false),
        (action.target = target),
        (action.fixed = fixed),
        (action.values = new Map([
          [target, target.valueAsNumber],
          [fixed, fixed?.valueAsNumber],
        ]));
    });

    const finishAction = $((event: Event) => {
      action = undefined;
    });

    /**
     * The move handler tracks handle hovering to facilitate proper ripple
     * behavior on the slider handle. This is needed because user interaction with
     * the native input is leveraged to position the handle. Because the separate
     * displayed handle element has pointer events disabled (to allow interaction
     * with the input) and the input's handle is a pseudo-element, neither can be
     * the ripple's interactive element. Therefore the input is the ripple's
     * interactive element and has a `ripple` directive; however the ripple
     * is gated on the handle being hovered. In addition, because the ripple
     * hover state is being specially handled, it must be triggered independent
     * of the directive. This is done based on the hover state when the
     * slider is updated.
     */
    const handleMove = $((event: PointerEvent) => {
      state.handleStartHover = !disabled && inBounds(event, handleStart.value);
      state.handleEndHover = !disabled && inBounds(event, handleEnd.value);
    });

    const handleEnter = $((event: PointerEvent) => {
      handleMove(event);
    });

    const handleLeave = $(() => {
      state.handleStartHover = false;
      state.handleEndHover = false;
    });

    const updateOnTop = $((input: HTMLInputElement) => {
      state.startOnTop = input.classList.contains("start");
    });

    const needsClamping = useComputed$(() => {
      if (!action) {
        return false;
      }

      const { target, fixed } = action;
      const isStart = target === inputStart.value;
      return isStart
        ? target.valueAsNumber > fixed.valueAsNumber
        : target.valueAsNumber < fixed.valueAsNumber;
    });

    // if start/end start coincident and the first drag input would e.g. move
    // start > end, avoid clamping and "flip" to use the other input
    // as the action target.
    const isActionFlipped = useComputed$(() => {
      const { action } = this;
      if (!action) {
        return false;
      }

      const { target, fixed, values } = action;
      if (action.canFlip) {
        const coincident = values.get(target) === values.get(fixed);
        if (coincident && needsClamping.value) {
          action.canFlip = false;
          action.flipped = true;
          action.target = fixed;
          action.fixed = target;
        }
      }
      return action.flipped;
    });

    // when flipped, apply the drag input to the flipped target and reset
    // the actual target.
    const flipAction = $(() => {
      if (!action) {
        return false;
      }

      const { target, fixed, values } = action;
      const changed = target.valueAsNumber !== fixed.valueAsNumber;
      target.valueAsNumber = fixed.valueAsNumber;
      fixed.valueAsNumber = values.get(fixed)!;
      return changed;
    });

    // clamp such that start does not move beyond end and visa versa.
    const clampAction = $(() => {
      if (!needsClamping.value || !action) {
        return false;
      }
      const { target, fixed } = action;
      target.valueAsNumber = fixed.valueAsNumber;
      return true;
    });

    const handleInput = $(async (event: InputEvent) => {
      // avoid processing a re-dispatched event
      if (isRedispatchingEvent.value) {
        return;
      }
      let stopPropagation = false;
      let redispatch = false;
      if (ctx.range) {
        if (isActionFlipped.value) {
          stopPropagation = true;
          redispatch = await flipAction();
        }
        if (await clampAction()) {
          stopPropagation = true;
          redispatch = false;
        }
      }
      const target = event.target as HTMLInputElement;
      updateOnTop(target);
      // update value only on interaction
      if (ctx.range) {
        valueStart = inputStart.value!.valueAsNumber;
        valueEnd = inputEnd.value!.valueAsNumber;
      } else {
        value = inputEnd.value!.valueAsNumber;
      }
      // control external visibility of input event
      if (stopPropagation) {
        event.stopPropagation();
      }
      // ensure event path is correct when flipped.
      if (redispatch) {
        isRedispatchingEvent.value = true;
        redispatchEvent(target, event);
        isRedispatchingEvent.value = false;
      }
    });

    const handleChange = $((event: Event) => {
      // prevent keyboard triggered changes from dispatching for
      // clamped values; note, this only occurs for keyboard
      const changeTarget = event.target as HTMLInputElement;
      const { target, values } = action ?? {};
      const squelch =
        target && target.valueAsNumber === values!.get(changeTarget)!;
      if (!squelch) {
        redispatchEvent(this, event);
      }
      // ensure keyboard triggered change clears action.
      finishAction(event);
    });

    const [getFormValue] = $(() => {
      if (range) {
        const data = new FormData();
        data.append(nameStart, String(valueStart));
        data.append(nameEnd, String(valueEnd));
        return data;
      }

      return String(value);
    });

    const formResetCallback = $(() => {
      if (range) {
        const valueStart = this.getAttribute("value-start");
        state.valueStart = valueStart !== null ? Number(valueStart) : undefined;
        const valueEnd = this.getAttribute("value-end");
        state.valueEnd = valueEnd !== null ? Number(valueEnd) : undefined;
        return;
      }
      const value = this.getAttribute("value");
      value = value !== null ? Number(value) : undefined;
    });

    const formStateRestoreCallback = $(
      (state: string | Array<[string, string]> | null) => {
        if (Array.isArray(state)) {
          const [[, valueStart], [, valueEnd]] = state;
          state.valueStart = Number(valueStart);
          state.valueEnd = Number(valueEnd);
          range = true;
          return;
        }

        value = Number(state);
        range = false;
      },
    );
    const handleKeydown = $((event: KeyboardEvent) => {
      startAction(event);
    });

    const handleKeyup = $((event: KeyboardEvent) => {
      finishAction(event);
    });

    const handleDown = $((event: PointerEvent) => {
      startAction(event);
      ripplePointerId.value = event.pointerId;
      const isStart = (event.target as HTMLInputElement) === inputStart.value;
      // Since handle moves to pointer on down and there may not be a move,
      // it needs to be considered hovered..
      state.handleStartHover = !disabled && isStart && Boolean(handleStart);
      state.handleEndHover = !disabled && !isStart && Boolean(handleEnd.value);
    });

    const handleUp = $(async (event: PointerEvent) => {
      if (!action) {
        return;
      }

      const { target, values, flipped } = action;
      //  Async here for Firefox because input can be after pointerup
      //  when value is clamped.
      await new Promise(requestAnimationFrame);
      if (target !== undefined) {
        // Ensure Safari focuses input so label renders.
        // Ensure any flipped input is focused so the tab order is right.
        target.focus();
        // When action is flipped, change must be fired manually since the
        // real event target did not change.
        if (flipped && target.valueAsNumber !== values.get(target)!) {
          target.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      finishAction(event);
    });
    return (
      <input
        type="range"
        class={{
          start,
          end: !start,
        }}
        onFocus$={handleFocus}
        onPointerDown$={handleDown}
        onPointerUp$={handleUp}
        onPointerEnter$={handleEnter}
        onPointerMove$={handleMove}
        onPointerLeave$={handleLeave}
        onKeyDown$={handleKeydown}
        onKeyUp$={handleKeyup}
        onInput$={handleInput}
        onChange$={handleChange}
        id={id + "-" + name}
        disabled={disabled}
        min={min}
        aria-valuemin={ariaMin}
        max={max}
        aria-valuemax={ariaMax}
        step={step}
        value={String(value)}
        tabIndex={start ? 1 : 0}
        aria-label={ariaLabel}
        aria-valuetext={ariaValueText}
      />
    );
  },
);

function inBounds({ x, y }: PointerEvent, element?: HTMLElement | undefined) {
  if (!element) {
    return false;
  }
  const { top, left, bottom, right } = element.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
}

const isOverlapping = $(
  (elA: Element | null | undefined, elB: Element | null | undefined) => {
    if (!(elA && elB)) {
      return false;
    }
    const a = elA.getBoundingClientRect();
    const b = elB.getBoundingClientRect();
    return !(
      a.top > b.bottom ||
      a.right < b.left ||
      a.bottom < b.top ||
      a.left > b.right
    );
  },
);

interface Action {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement | undefined, number | undefined>;
}
