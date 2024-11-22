import type { PropsOf } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";

/**
 * @deprecated This component is deprecated and will be removed in future releases.
 */
export const HModalContent = component$((props: PropsOf<"div">) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
