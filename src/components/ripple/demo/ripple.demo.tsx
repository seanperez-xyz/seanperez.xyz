import { component$ } from "@builder.io/qwik";
import { Ripple } from "../ripple";

export const RippleDemo = component$(() => {
  return (
    <div class="flex items-center gap-8 p-8">
      <div class="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-3xl bg-surface outline outline-1 outline-outline">
        <Ripple />
      </div>

      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-surface outline-dashed outline-1 outline-outline">
        <div class="relative flex h-6 w-6 place-content-center items-center justify-center rounded-[50%] border border-outline bg-primary-container">
          <Ripple unbounded />
        </div>
      </div>

      <div
        aria-disabled={true}
        class="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-surface outline outline-1 outline-outline aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-on-surface/38 aria-disabled:placeholder-opacity-100 aria-disabled:opacity-12"
      >
        <Ripple disabled />
      </div>
    </div>
  );
});
