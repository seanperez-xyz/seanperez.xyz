import { isServer } from "@builder.io/qwik/build";
import {
    applyMaterialTheme,
    themeFromSourceColor,
} from './color-helpers';
import type { ThemeMode, SystemTheme } from "../themed.types";

/**
 * Generates a Material Theme from a given color and dark mode boolean, and
 * applies the theme to the document and lets the app know that the theme has
 * changed.
 *
 * @param color The source color to generate the theme.
 * @param isDark Whether or not the theme should be in dark mode.
 */
function applyThemeFromColor(color: string, isDark: boolean) {
    const theme = themeFromSourceColor(color, isDark);
    applyMaterialTheme(document, theme);
    // Dispatches event to communicate with components pages' JS to update the
    // theme in the playground preview.
    window.dispatchEvent(new Event('theme-changed'));
}

/**
 * Determines whether or not the mode should be Dark. This also means
 * calculating whether it should be dark if the current mode is 'system'.
 *
 * @param mode The current color mode 'light', 'dark', or 'system'.
 * @param saveSystemMode (Optional) Whether or not to save last system mode to
 *     localstorage. Set to false if you simply want to query whether system mode
 *     is dark or not. Defaults to true.
 * @return Whether or not the dark mode color tokens should apply.
 */
export function getSystemTheme(mode: ThemeMode, saveSystemMode = true): SystemTheme {
    let isDark = mode === 'dark';

    // Determines whether the system mode should display light or dark.
    if (mode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saveSystemMode) {
            // We have to save this because if the user closes the tab when it's light
            // and reopens it when it's dark, we need to know whether the last applied
            // 'system' mode was correct.
            saveLastSavedSystemColorMode(isDark ? 'dark' : 'light');
        }
    }

    return isDark ? "dark" : "light";
}

/**
 * Gets the current stringified material theme css string from localstorage.
 *
 * @return The current stringified material theme css string.
 */
export function getCurrentThemeString(key: string, fallback?: string) {
    if (isServer) return undefined
    let theme: any
    try {
        theme = localStorage.getItem(key) || undefined
    } catch (e) {
        // Unsupported
    }
    return theme || fallback
}

/**
 * Gets the current color mode from localstorage.
 *
 * @return The current color mode.
 */
export function getCurrentMode(): ThemeMode | null {
    return localStorage.getItem('color-mode') as ThemeMode | null;
}

/**
 * Saves the given color mode to localstorage.
 *
 * @param mode The color mode to save to localstorage.
 */
export function saveColorMode(mode: ThemeMode) {
    localStorage.setItem('color-mode', mode);
}

/**
 * Gets the current seed color from localstorage.
 *
 * @return The current seed color.
 */
export function getCurrentSeedColor(): string | null {
    return localStorage.getItem('seed-color');
}

/**
 * Saves the given seed color to localstorage.
 *
 * @param color The seed color to save to local storage.
 */
export function saveSeedColor(color: string) {
    localStorage.setItem('seed-color', color);
}

/**
 * Gets last applied color mode while in "system" from localstorage.
 *
 * @return The last applied color mode while in "system".
 */
export function getLastSavedSystemColorMode() {
    return localStorage.getItem('last-system-color-mode') as
        | 'light'
        | 'dark'
        | null;
}

/**
 * Saves last applied color mode while in "system" from localstorage.
 *
 * @param mode The last applied color mode while in "system" to be saved to local
 *     storage.
 */
export function saveLastSavedSystemColorMode(mode: 'light' | 'dark') {
    localStorage.setItem('last-system-color-mode', mode);
}

/**
 * Generates and applies a new theme due to a change in source color.
 *
 * @param color The new source color from which to generate the new theme.
 */
export function changeColor(color: string) {
    const lastColorMode = getCurrentMode()!;
    const isDark = getSystemTheme(lastColorMode) === "dark";

    applyThemeFromColor(color, isDark);
    saveSeedColor(color);
}

/**
 * Generates and applies a new theme due to a change in color mode.
 *
 * @param mode The new color mode from which to generate the new theme.
 */
export function changeColorMode(mode: ThemeMode) {
    const color = getCurrentSeedColor()!;
    const isDark = getSystemTheme(mode) === "dark";

    applyThemeFromColor(color, isDark);
    saveColorMode(mode);
}

/**
 * Generates and applies a new theme due to a change in both source color and
 * color mode.
 *
 * @param color The new source color from which to generate the new theme.
 * @param mode The new color mode from which to generate the new theme.
 */
export function changeColorAndMode(color: string, mode: ThemeMode) {
    const isDark = getSystemTheme(mode) === "dark";

    applyThemeFromColor(color, isDark);
    saveSeedColor(color);
    saveColorMode(mode);
}