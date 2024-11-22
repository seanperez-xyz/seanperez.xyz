import {
  component$,
  Fragment,
  Slot,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { ThemeConfig as config } from "./constants";
import { ThemedContext, type ThemedContextValue } from "./themed-context";
import { ThemeScript } from "./themed-script";
import type { ThemeProviderProps } from "./themed.types";
import { ThemeBaseColors } from "./constants";

export const defaultThemes = ["light", "dark"];

export const ThemedRoot = component$<ThemeProviderProps>(
  ({
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = true,
    storageKey = config.storageKey,
    themes = defaultThemes,
    defaultTheme = enableSystem ? "system" : "light",
    attribute = "data-theme",
    value,
    nonce,
  }) => {
    const attrs = !value ? themes.flat() : Object.values(value);

    const state = useStore<ThemedContextValue>({
      selectedColorMode: defaultTheme === "dark" ? "dark" : "light",
      hexColor: ThemeBaseColors.DEFAULT,
      hue: 0,
      chroma: 0,
      tone: 0,
    });

    useContextProvider(ThemedContext, state);

    return (
      <Fragment>
        <ThemeScript
          {...{
            forcedTheme,
            disableTransitionOnChange,
            enableSystem,
            enableColorScheme,
            storageKey,
            themes,
            defaultTheme,
            attribute,
            value,
            attrs,
            nonce,
          }}
        />
        <Slot />
      </Fragment>
    );
  },
);
