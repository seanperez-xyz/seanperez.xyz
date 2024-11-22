import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import * as Menu from "~/components/menu";
import { Slider } from "~/components/slider/old-slider";
import { HCTSlider } from "~/components/theme-toggle/hct-slider";
import { hexFromHct } from "~/components/theme-toggle/utils/color-helpers";
import { ElevationDemo } from "~/components/elevation";
import { RippleDemo } from "~/components/ripple/demo/ripple.demo";

export default component$(() => {
  // Add signals for HCT values
  const hueSignal = useSignal("180");
  const chromaSignal = useSignal("50");
  const toneSignal = useSignal("60");

  // Compute the current color based on HCT values
  const currentColor = useComputed$(() => {
    const hue = Number(hueSignal.value);
    const chroma = Number(chromaSignal.value);
    const tone = Number(toneSignal.value);
    return hexFromHct(hue, chroma, tone);
  });

  return (
    <div class="container p-4">
      <h2 class="mb-8 text-headline-large">Components</h2>

      {/* HCT Slider Demo Section */}
      <section class="mt-8">
        <h3 class="mb-4 text-headline-small">HCT Slider</h3>
        <div class="rounded-lg bg-surface p-6">
          <div class="flex flex-col gap-8">
            <div>
              <h4 class="mb-4 text-title-medium">Hue Slider</h4>
              <HCTSlider
                label="Hue"
                type="hue"
                color={currentColor.value}
                bind:color={currentColor}
                bind:value={hueSignal}
              />
            </div>

            <div>
              <h4 class="mb-4 text-title-medium">Chroma Slider</h4>
              <HCTSlider
                label="Chroma"
                type="chroma"
                color={currentColor.value}
                bind:color={currentColor}
                bind:value={chromaSignal}
              />
            </div>

            <div>
              <h4 class="mb-4 text-title-medium">Tone Slider</h4>
              <HCTSlider
                label="Tone"
                type="tone"
                color={currentColor.value}
                bind:color={currentColor}
                bind:value={toneSignal}
              />
            </div>

            {/* Color Preview */}
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-full border border-outline"
                style={{ backgroundColor: currentColor.value }}
              />
              <span class="text-body-large">{currentColor.value}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Regular Slider Demo Section */}
      <section class="mt-8">
        <h3 class="mb-4 text-headline-small">Slider</h3>
        <div class="rounded-lg bg-surface p-6">
          <div class="flex flex-col gap-12">
            <div>
              <h4 class="mb-4 text-title-medium">Basic Slider</h4>
              <Slider value={50} />
            </div>

            <div>
              <h4 class="mb-4 text-title-medium">Range Slider with Labels</h4>
              <Slider range valueStart={20} valueEnd={80} labeled />
            </div>

            <div>
              <h4 class="mb-4 text-title-medium">Slider with Ticks</h4>
              <Slider ticks step={10} value={30} />
            </div>

            <div>
              <h4 class="mb-4 text-title-medium">Disabled Slider</h4>
              <Slider value={60} disabled />
            </div>

            <div>
              <h4 class="mb-4 text-title-medium">
                Range Slider with Ticks and Labels
              </h4>
              <Slider
                range
                ticks
                step={20}
                valueStart={20}
                valueEnd={80}
                labeled
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section class="mt-8">
        <h3 class="mb-4 text-headline-small">Menu</h3>
        <div class="rounded-lg bg-surface p-6">
          <div class="flex gap-4">
            <Menu.Root>
              <button
                slot="anchor"
                class="rounded-full bg-primary px-6 py-2.5 text-on-primary hover:bg-primary/90"
              >
                Open Menu
              </button>
              <Menu.Item>
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item>
                <span>Option 2</span>
              </Menu.Item>
              <Menu.SubMenu>
                <Menu.Item q:slot="trigger">
                  <span>Submenu</span>
                  <span class="material-icons" slot="end">
                    arrow_right
                  </span>
                </Menu.Item>
                <Menu.Root q:slot="menu">
                  <Menu.Item>
                    <span>Sub Option 1</span>
                  </Menu.Item>
                  <Menu.Item>
                    <span>Sub Option 2</span>
                  </Menu.Item>
                </Menu.Root>
              </Menu.SubMenu>
              <Menu.Item>
                <span>Option 3</span>
              </Menu.Item>
            </Menu.Root>
          </div>
        </div>
      </section>

      {/* Elevation Demo Section */}
      <section class="mt-8">
        <h3 class="mb-4 text-headline-small">Elevation</h3>
        <div class="rounded-lg bg-surface p-6">
          <ElevationDemo />
        </div>
      </section>

      {/* Ripple Demo Section */}
      <section class="mt-8">
        <h3 class="mb-4 text-headline-small">Ripple</h3>
        <div class="rounded-lg bg-surface p-6">
          <RippleDemo />
        </div>
      </section>
    </div>
  );
});
