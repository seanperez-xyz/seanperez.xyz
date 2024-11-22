import { $, component$, useOn, useSignal } from "@builder.io/qwik";
import type { RippleProps } from "./ripple.types";

export const Ripple = component$<RippleProps>(
  ({
    disabled = false,
    unbounded = false,
    centered = false,
    class: className,
    ...props
  }) => {
    const rootRef = useSignal<HTMLElement>();
    const surfaceRef = useSignal<HTMLElement>();

    const handlePointerDown = $((event: PointerEvent) => {
      if (disabled || !rootRef.value || !surfaceRef.value) return;

      const rect = rootRef.value.getBoundingClientRect();
      const maxDim = Math.max(rect.width, rect.height);

      let x, y;
      if (centered || unbounded) {
        x = rect.width / 2;
        y = rect.height / 2;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      const ripple = document.createElement("div");
      ripple.style.width = ripple.style.height = `${maxDim * 2}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = [
        "absolute -translate-x-1/2 -translate-y-1/2",
        "rounded-full pointer-events-none",
        "bg-on-surface/12",
        "origin-center scale-0",
        "animate-ripple",
      ].join(" ");

      surfaceRef.value.appendChild(ripple);

      // Cleanup
      setTimeout(() => {
        ripple.remove();
      }, 450);
    });

    useOn("pointerdown", handlePointerDown);

    return (
      <span
        ref={rootRef}
        aria-hidden="true"
        aria-disabled={disabled}
        class={[
          "pointer-events-none m-auto flex",
          "absolute overflow-hidden",
          "aria-disabled:hidden forced-colors:hidden",
          unbounded ? "inset-unset rounded-50" : "rounded-inherit inset-0",
          className,
        ]}
        {...props}
      >
        <div
          ref={surfaceRef}
          class={[
            "rounded-inherit absolute inset-0 overflow-hidden",
            // Hover state layer
            "before:absolute before:inset-0 before:bg-on-surface/8",
            "before:duration-15 before:opacity-0 before:transition-opacity",
            "before:content-[''] hover:before:opacity-100",
            // Press state layer
            "after:absolute after:inset-0 after:bg-on-surface/12",
            "after:opacity-0 after:transition-opacity after:duration-105",
            "after:content-[''] active:after:opacity-100",
          ]}
        />
      </span>
    );
  },
);
