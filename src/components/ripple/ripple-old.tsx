import { component$, useSignal, $ } from "@builder.io/qwik";
import { cn } from "~/utils";
import type { RippleProps } from "./ripple.types";

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;

interface RippleState {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const Ripple = component$<RippleProps>((props) => {
  const { disabled, unbounded, centered, class: className } = props;

  const ripples = useSignal<RippleState[]>([]);
  const nextId = useSignal(0);

  const handlePointerDown = $((event: PointerEvent, el: HTMLDivElement) => {
    if (disabled) return;

    // Ensure the click is within the intended clickable area
    if (!el.contains(event.target as Node)) return;

    const rect = el.getBoundingClientRect();
    const rippleId = nextId.value++;

    let x: number, y: number, size: number;

    if (unbounded) {
      const parentRect =
        el.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        size = Math.max(parentRect.width, parentRect.height);
        if (centered) {
          x = rect.width / 2;
          y = rect.height / 2;
        } else {
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
        }
      } else {
        size = Math.max(rect.width, rect.height);
        x = centered ? rect.width / 2 : event.clientX - rect.left;
        y = centered ? rect.height / 2 : event.clientY - rect.top;
      }
    } else {
      x = centered ? rect.width / 2 : event.clientX - rect.left;
      y = centered ? rect.height / 2 : event.clientY - rect.top;
      const maxDistanceX = Math.max(x, rect.width - x);
      const maxDistanceY = Math.max(y, rect.height - y);
      size = 2 * Math.sqrt(maxDistanceX ** 2 + maxDistanceY ** 2);
    }

    ripples.value = [...ripples.value, { id: rippleId, x, y, size }];

    setTimeout(() => {
      const ripple = document.querySelector(`[data-ripple-id="${rippleId}"]`);
      if (ripple) {
        ripple.classList.add("animate-ripple-out");
      }
      setTimeout(() => {
        ripples.value = ripples.value.filter((r) => r.id !== rippleId);
      }, MINIMUM_PRESS_MS);
    }, PRESS_GROW_MS);
  });

  if (disabled) return null;

  return (
    <div
      onPointerDown$={handlePointerDown}
      class={cn(
        "absolute",
        unbounded
          ? "inset-0 overflow-visible rounded-full"
          : "inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      {ripples.value.map((ripple) => (
        <div
          key={ripple.id}
          data-ripple-id={ripple.id}
          class={cn(
            "animate-ripple-in absolute rounded-[50%] bg-current opacity-0",
          )}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            transform: `translate(-50%, -50%) scale(0)`,
          }}
        />
      ))}
    </div>
  );
});
