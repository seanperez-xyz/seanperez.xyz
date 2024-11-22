import type { PropsOf } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

export const CheckMark = component$<PropsOf<"svg">>((props) => (
  <svg
    class="checkmark h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" class="stroke-current !stroke-[2]" />
  </svg>
));
