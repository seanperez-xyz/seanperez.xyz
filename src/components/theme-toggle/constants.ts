
// base default config
export const ThemeConfig = {
    storageKey: "theme"
}

// util constants
export const ThemeBaseColors = {
    DEFAULT: import.meta.env.THEME_BASE_COLOR,
    BLUE: '#769CDF',
    RED: '#B33B15',
    GREEN: '#63A002',
    YELLOW: '#FFDE3F',
} as const;

export type ThemeBaseColor = (typeof ThemeBaseColors)[keyof typeof ThemeBaseColors] | string;