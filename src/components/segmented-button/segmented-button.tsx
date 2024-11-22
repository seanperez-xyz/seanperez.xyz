import type { JSXOutput, PropsOf, QRL, Signal } from "@builder.io/qwik";
import { component$, Slot, sync$, useTask$, $ } from "@builder.io/qwik";
import { cn, useBoundSignal } from "~/utils";
import { CheckMark } from "./icons";
import { segmentedButtonVariants } from "./variants";
import type { VariantProps } from "class-variance-authority";

export interface SegmentedButtonProps
  extends PropsOf<"button">,
    VariantProps<typeof segmentedButtonVariants> {
  label?: JSXOutput;
  selected?: boolean;
  "bind:selected"?: Signal<boolean>;
  onSelectedChange$?: QRL<(pressed: boolean) => void>;
  noCheckmark?: boolean;
  deselectable?: boolean;
}

export const SegmentedButton = component$<SegmentedButtonProps>((props) => {
  const {
    label,
    disabled,
    selected: selectedProp,
    onSelectedChange$,
    "bind:selected": givenValueSig,
    noCheckmark,
    deselectable = false,
    hasIcon = false,
    class: className,
    title,
    ...buttonProps
  } = props;

  const selectedSig = useBoundSignal(
    givenValueSig,
    selectedProp ? selectedProp : false,
  );

  const handleKeyDownSync$ = sync$((event: KeyboardEvent) => {
    if (
      !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)
    )
      return;

    event.preventDefault();
  });

  useTask$(async ({ track }) => {
    if (selectedProp === undefined) return;
    track(() => selectedProp);
    selectedSig.value = selectedProp;
  });

  const handleClick$ = $(async () => {
    if (!disabled) {
      if (deselectable || !selectedSig.value) {
        selectedSig.value = !selectedSig.value;
        if (onSelectedChange$) {
          onSelectedChange$(selectedSig.value);
        }
      }
    }
  });

  return (
    <button
      class={cn(
        segmentedButtonVariants({
          hasIcon,
        }),
        className,
      )}
      title={title}
      disabled={disabled}
      aria-pressed={selectedSig.value}
      aria-disabled={disabled}
      onKeyDown$={[handleKeyDownSync$, props.onKeyDown$]}
      {...buttonProps}
      onClick$={[props.onClick$, handleClick$]}
    >
      <div class="relative flex items-center justify-center">
        <div
          class={cn(
            "relative flex items-center justify-center",
            "transition-[width] duration-150 ease-standard",
            selectedSig.value ? "w-5" : "w-0",
          )}
        >
          {selectedSig.value && !noCheckmark && (
            <CheckMark
              class={cn(
                "h-5 w-5",
                "!stroke-current !stroke-[2]",
                "z-10",
                "[&>polyline]:stroke-dasharray-[29.7833385]",
                "[&>polyline]:stroke-dashoffset-[29.7833385]",
                "duration-150 ease-standard animate-in fade-in-0",
                "motion-safe:animate-checkmark-draw",
              )}
            />
          )}
        </div>
        <div
          class={cn(
            "flex items-center gap-2",
            "transition-transform duration-150 ease-standard",
            selectedSig.value ? "translate-x-2" : "translate-x-0",
          )}
        >
          <Slot />
          {label && <span class="text-label-large font-medium">{label}</span>}
        </div>
      </div>
    </button>
  );
});
