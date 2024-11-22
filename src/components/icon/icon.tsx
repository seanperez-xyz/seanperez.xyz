import { component$ } from "@builder.io/qwik";

export interface IconProps {
  name: string;
  filled?: boolean;
  class?: string;
  ariaHidden?: boolean;
}
export const Icon = component$<IconProps>(
  ({ name, filled, class: className, ariaHidden = true }) => {
    return (
      <span
        aria-hidden={ariaHidden}
        class={["icon", className]}
        style={{
          "font-variation-settings": filled ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {name}
      </span>
    );
  },
);
