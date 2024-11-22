import type { QRL, Signal, JSXOutput, ClassList } from "@builder.io/qwik";
import { component$, Slot, $, sync$, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { cva, type VariantProps } from "class-variance-authority";
//
import { cn, useBoundSignal } from "~/utils";

export const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "outline-none relative",
    "h-10 w-10", // 40px container
    "[&>svg]:h-6 [&>svg]:w-6", // 24px icon
    "transition-[background-color,color,opacity] duration-200 ease-in-out",
    "disabled:pointer-events-none disabled:opacity-38",
    "aria-disabled:pointer-events-none aria-disabled:opacity-38",
    "focus-visible:ring-2 ring-offset-0",
  ],
  {
    variants: {
      look: {
        standard: [
          "text-on-surface-variant hover:bg-on-surface-variant/8 active:bg-on-surface-variant/12 focus-visible:bg-on-surface-variant/12",
          "aria-pressed:text-primary aria-pressed:bg-primary/12 aria-pressed:hover:bg-primary/16 aria-pressed:active:bg-primary/16 aria-pressed:focus-visible:bg-primary/16",
        ],
        filled: [
          "bg-primary text-on-primary hover:bg-primary/92 active:bg-primary/88 focus-visible:bg-primary/88",
          "aria-pressed:bg-primary/88 aria-pressed:hover:bg-primary/92 aria-pressed:active:bg-primary/88 aria-pressed:focus-visible:bg-primary/88",
        ],
        tonal: [
          "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/92 active:bg-secondary-container/88 focus-visible:bg-secondary-container/88",
          "aria-pressed:bg-secondary-container/88 aria-pressed:hover:bg-secondary-container/92 aria-pressed:active:bg-secondary-container/88 aria-pressed:focus-visible:bg-secondary-container/88",
        ],
        outlined: [
          "text-on-surface-variant border border-outline hover:bg-on-surface-variant/8 active:bg-on-surface-variant/12 focus-visible:bg-on-surface-variant/12",
          "aria-pressed:text-primary aria-pressed:border-0 aria-pressed:bg-primary/12 aria-pressed:hover:bg-primary/16 aria-pressed:active:bg-primary/16 aria-pressed:focus-visible:bg-primary/16",
        ],
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      look: "standard",
      rounded: "full",
    },
  },
);

export interface IconButtonProps
  extends VariantProps<typeof iconButtonVariants> {
  /** The aria-label of the button */
  "aria-label": string;
  /** The aria-label when the button is selected */
  ariaLabelSelected?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is "soft" disabled (disabled but focusable) */
  softDisabled?: boolean;
  /** Whether to flip the icon in RTL */
  flipIconInRtl?: boolean;
  /** Sets the underlying HTMLAnchorElement's href resource attribute */
  href?: string;
  /** Sets the underlying HTMLAnchorElement's target attribute */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Type attribute - button, submit, or reset */
  type?: "button" | "submit" | "reset";
  /** Whether the button is selected/pressed */
  selected?: boolean;
  /** When true, the button will toggle between selected and unselected states */
  toggle?: boolean;
  /** Button title attribute */
  title?: string;
  /** Callback that fires when the toggle state changes */
  onSelectedChange$?: QRL<(selected: boolean) => void>;
  /** Reactive value for controlled selection state */
  "bind:selected"?: Signal<boolean>;
  /** Icon to show when selected (true uses selected slot) */
  selectedIcon?: JSXOutput | true;
  /** Class to apply to selected icon */
  selectedClass?: string;
  /** Class to apply to default icon */
  iconClass?: string;
  /** Whether the context is RTL */
  isRtl?: boolean;
  /** Click handler */
  onClick$?: QRL<
    (
      event: PointerEvent,
      element: HTMLButtonElement | HTMLAnchorElement,
    ) => void
  >;
  /** Form attributes */
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Additional classes */
  class?: ClassList;
  /** Value attribute for form submission */
  value?: string | number;
}

export const IconButton = component$<IconButtonProps>((props) => {
  const {
    selected: selectedProp,
    class: className,
    onSelectedChange$,
    "bind:selected": givenValueSig,
    selectedIcon,
    selectedClass,
    iconClass,
    isRtl,
    flipIconInRtl,
  } = props;

  const selectedSig = useBoundSignal(givenValueSig, selectedProp ?? false);

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

  const handleClick$ = $(
    async (
      event: PointerEvent,
      element: HTMLButtonElement | HTMLAnchorElement,
    ) => {
      if (!props.disabled && !props.softDisabled) {
        if (props.toggle) {
          selectedSig.value = !selectedSig.value;

          // Dispatch input and change events
          element.dispatchEvent(
            new InputEvent("input", { bubbles: true, composed: true }),
          );
          element.dispatchEvent(new Event("change", { bubbles: true }));

          if (onSelectedChange$) {
            await onSelectedChange$(selectedSig.value);
          }
        }
      }
    },
  );

  const Tag = props.href ? (props.target === "_blank" ? "a" : Link) : "button";

  return (
    <Tag
      {...(props.form && { form: props.form })}
      {...(props.formAction && { formAction: props.formAction })}
      {...(props.formEncType && { formEncType: props.formEncType })}
      {...(props.formMethod && { formMethod: props.formMethod })}
      {...(props.formNoValidate && { formNoValidate: props.formNoValidate })}
      {...(props.formTarget && { formTarget: props.formTarget })}
      {...(props.name && { name: props.name })}
      {...(props.value && { value: props.value })}
      class={cn(
        iconButtonVariants({ look: props.look, rounded: props.rounded }),
        isRtl && flipIconInRtl && "rtl:-scale-x-100",
        className,
      )}
      aria-pressed={props.toggle ? selectedSig.value : undefined}
      disabled={!props.href && props.disabled}
      title={props.title}
      aria-disabled={!props.href && props.softDisabled}
      aria-label={
        selectedSig.value && props.ariaLabelSelected
          ? props.ariaLabelSelected
          : props["aria-label"]
      }
      href={props.href}
      target={props.target}
      {...(props.target === "_blank" && { rel: "noopener noreferrer" })}
      type={!props.href ? props.type : undefined}
      preventdefault:click={props.softDisabled}
      stoppropagation:click={props.softDisabled}
      onKeyDown$={handleKeyDownSync$}
      onClick$={[props.onClick$, handleClick$]}
    >
      {/* Default icon */}
      <span
        class={cn(
          "inline-flex items-center justify-center",
          selectedIcon && selectedSig.value && "hidden",
          !selectedIcon || (!selectedSig.value && "block"),
          iconClass,
        )}
      >
        <Slot />
      </span>

      {/* Selected icon */}
      {selectedIcon && (
        <span
          class={cn(
            "inline-flex items-center justify-center",
            selectedSig.value ? "block" : "hidden",
            selectedClass,
          )}
        >
          {selectedIcon === true ? <Slot name="selected" /> : selectedIcon}
        </span>
      )}

      {/* Touch target */}
      <span class="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" />
    </Tag>
  );
});
