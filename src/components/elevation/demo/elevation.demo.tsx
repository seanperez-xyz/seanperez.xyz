import { component$, useSignal } from "@builder.io/qwik";
import { Elevation } from "../elevation";
import type { ElevationProps } from "../elevation.types";

export const ElevationDemo = component$(() => {
  const level = useSignal<ElevationProps["level"]>(1);
  const hoverLevel = useSignal<ElevationProps["level"]>(1);
  const baseLevel = useSignal<ElevationProps["level"]>(1);
  const hoverTargetLevel = useSignal<ElevationProps["level"]>(4);

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <h2 class="text-title-large">Interactive Elevation</h2>
        <div class="flex flex-wrap items-center gap-8">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <div class="flex flex-col gap-2">
                <span class="text-body-medium">Base Level</span>
                <div class="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={baseLevel.value}
                    class="w-48"
                    onInput$={(_, el) =>
                      (baseLevel.value = Number(
                        el.value,
                      ) as ElevationProps["level"])
                    }
                  />
                  <span class="min-w-[2ch] text-body-large">
                    {baseLevel.value}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex flex-col gap-2">
                <span class="text-body-medium">Hover Level</span>
                <div class="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={hoverTargetLevel.value}
                    class="w-48"
                    onInput$={(_, el) =>
                      (hoverTargetLevel.value = Number(
                        el.value,
                      ) as ElevationProps["level"])
                    }
                  />
                  <span class="min-w-[2ch] text-body-large">
                    {hoverTargetLevel.value}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="relative h-32 w-32 cursor-pointer rounded-lg bg-surface-container-low text-on-surface transition-all duration-medium-1 ease-standard"
              onPointerEnter$={() =>
                (hoverLevel.value = hoverTargetLevel.value)
              }
              onPointerLeave$={() => (hoverLevel.value = baseLevel.value)}
              style={{
                "--elevation-level": hoverLevel.value,
              }}
            >
              <Elevation level={hoverLevel.value} />
              <div class="absolute inset-0 flex items-center justify-center">
                {hoverLevel.value === baseLevel.value ? 
                  baseLevel.value : 
                  `${baseLevel.value} → ${hoverLevel.value}`
                }
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5"
                value={level.value}
                class="w-48"
                onInput$={(_, el) =>
                  (level.value = Number(el.value) as ElevationProps["level"])
                }
              />
              <span class="min-w-[2ch] text-body-large">{level.value}</span>
            </div>
            <div
              class="relative h-32 w-32 rounded-lg bg-surface-container-low text-on-surface transition-all duration-medium-1 ease-standard"
              style={{
                "--elevation-level": level.value,
              }}
            >
              <Elevation level={level.value} />
              <div class="absolute inset-0 flex items-center justify-center">
                {level.value}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-title-large">All Elevation Levels</h2>
        <div class="grid auto-rows-fr grid-cols-[repeat(auto-fit,_minmax(128px,_1fr))] gap-8">
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <div
              key={l}
              class="relative mx-auto h-32 w-32 rounded-lg bg-surface-container-low text-on-surface transition-all duration-medium-1 ease-standard"
              style={{
                "--elevation-level": l,
              }}
            >
              <Elevation level={l as ElevationProps["level"]} />
              <div class="absolute inset-0 flex items-center justify-center">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
