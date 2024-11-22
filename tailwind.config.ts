import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ["class"],
  theme: {
    extend: {

      backgroundImage: {
        'radial-gradient': 'radial-gradient(closest-side, var(--color-on-surface) max(calc(100% - 70px), 65%), transparent 100%)',
      },
      borderRadius: {
        50: '50%',
        inherit: 'inherit',
        none: 'var(--shape-corner-none, 0)',
        xs: 'var(--shape-corner-extra-small, 0.25rem',
        'xs-top': 'var(--shape-corner-extra-small-top, 0.25rem 0.25rem 0 0',
        sm: 'var(--shape-corner-small, 0.5rem)',
        med: 'var(--shape-corner-medium, 0.75rem)',
        lg: 'var(--shape-corner-large, 1rem)',
        'lg-end': 'var(--shape-corner-large-end, 0 1rem 1rem 0)',
        'lg-start': 'var(--shape-corner-large-start, 1rem 0px 0 1rem)',
        'lg-top': 'var(--shape-corner-large-top, 1rem 1rem 0 0)',
        xl: 'var(--shape-corner-extra-large-top, 1.75rem 1.75rem 0 0)',
        'xl-top': 'var(--shape-corner-extra-large-top, 1.75rem)',
        full: 'var(--shape-corner-full, 9999px)',
      },
      borderWidth: {
        DEFAULT: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        8: '8px',
      },
      boxShadow: {
        'elevation-0': 'var(--elevation-level-0)',
        'elevation-1': 'var(--elevation-level-1)',
        'elevation-2': 'var(--elevation-level-2)',
        'elevation-3': 'var(--elevation-level-3)',
        'elevation-4': 'var(--elevation-level-4)',
        'elevation-5': 'var(--elevation-level-5)',
      },
      colors: {
        seed: 'rgb(var(--color-seed))',
        primary: 'rgb(var(--color-primary))',
        'on-primary': 'rgb(var(--color-on-primary))',
        'primary-container': 'rgb(var(--color-primary-container))',
        'on-primary-container': 'rgb(var(--color-on-primary-container))',
        secondary: 'rgb(var(--color-secondary))',
        'on-secondary': 'rgb(var(--color-on-secondary))',
        'secondary-container': 'rgb(var(--color-secondary-container))',
        'on-secondary-container': 'rgb(var(--color-on-secondary-container))',
        tertiary: 'rgb(var(--color-tertiary))',
        'on-tertiary': 'rgb(var(--color-on-tertiary))',
        'tertiary-container': 'rgb(var(--color-tertiary-container))',
        'on-tertiary-container': 'rgb(var(--color-on-tertiary-container))',
        error: 'rgb(var(--color-error))',
        'on-error': 'rgb(var(--color-on-error))',
        'error-container': 'rgb(var(--color-error-container))',
        'on-error-container': 'rgb(var(--color-on-error-container))',
        background: 'rgb(var(--color-background))',
        'on-background': 'rgb(var(--color-on-background))',
        surface: 'rgb(var(--color-surface))',
        'on-surface': 'rgb(var(--color-on-surface))',
        'surface-variant': 'rgb(var(--color-surface-variant))',
        'on-surface-variant': 'rgb(var(--color-on-surface-variant))',
        outline: 'rgb(var(--color-outline))',
        'outline-variant': 'rgb(var(--color-outline-variant))',
        shadow: 'rgb(var(--color-shadow))',
        scrim: 'rgb(var(--color-scrim))',
        'inverse-surface': 'rgb(var(--color-inverse-surface))',
        'inverse-on-surface': 'rgb(var(--color-inverse-on-surface))',
        'inverse-primary': 'rgb(var(--color-inverse-primary))',
        'primary-fixed': 'rgb(var(--color-primary-fixed))',
        'on-primary-fixed': 'rgb(var(--color-on-primary-fixed))',
        'primary-fixed-dim': 'rgb(var(--color-primary-fixed-dim))',
        'on-primary-fixed-variant': 'rgb(var(--color-on-primary-fixed-variant))',
        'secondary-fixed': 'rgb(var(--color-secondary-fixed))',
        'on-secondary-fixed': 'rgb(var(--color-on-secondary-fixed))',
        'secondary-fixed-dim': 'rgb(var(--color-secondary-fixed-dim))',
        'on-secondary-fixed-variant': 'rgb(var(--color-on-secondary-fixed-variant))',
        'tertiary-fixed': 'rgb(var(--color-tertiary-fixed))',
        'on-tertiary-fixed': 'rgb(var(--color-on-tertiary-fixed))',
        'tertiary-fixed-dim': 'rgb(var(--color-tertiary-fixed-dim))',
        'on-tertiary-fixed-variant': 'rgb(var(--color-on-tertiary-fixed-variant))',
        ring: 'rgb(var(--color-ring))',
        'surface-dim': 'rgb(var(--color-surface-dim))',
        'surface-bright': 'rgb(var(--color-surface-bright))',
        'surface-container-lowest': 'rgb(var(--color-surface-container-lowest))',
        'surface-container-low': 'rgb(var(--color-surface-container-low))',
        'surface-container': 'rgb(var(--color-surface-container))',
        'surface-container-high': 'rgb(var(--color-surface-container-high))',
        'surface-container-highest': 'rgb(var(--color-surface-container-highest))',
        'surface-tint': 'rgb(var(--color-surface-tint))',
        'ripple-hover': 'rgba(0, 0, 0, 0.1)',
        'ripple-pressed': 'rgba(0, 0, 0, 0.3)',
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          sm: '100%',
          md: '100%',
          lg: '100%',
          xl: '75em'
        }
      },
      fontFamily: {
        brand: ['var(--typeface-brand)', ...fontFamily.sans],
        plain: ['var(--typeface-plain)', ...fontFamily.sans],
        sans: ['var(--typeface-sans)', ...fontFamily.sans],
        mono: ['var(--typeface-mono)', ...fontFamily.mono],
      },
      fontSize: {
        // Display styles
        'display-large': ['var(--typescale-display-large-size)', {
          lineHeight: 'var(--typescale-display-large-line-height)',
          letterSpacing: 'var(--typescale-display-large-tracking)',
          fontWeight: 'var(--typescale-display-large-weight)',
        }],
        'display-medium': ['var(--typescale-display-medium-size)', {
          lineHeight: 'var(--typescale-display-medium-line-height)',
          letterSpacing: 'var(--typescale-display-medium-tracking)',
          fontWeight: 'var(--typescale-display-medium-weight)',
        }],
        'display-small': ['var(--typescale-display-small-size)', {
          lineHeight: 'var(--typescale-display-small-line-height)',
          letterSpacing: 'var(--typescale-display-small-tracking)',
          fontWeight: 'var(--typescale-display-small-weight)',
        }],

        // Headline styles
        'headline-large': ['var(--typescale-headline-large-size)', {
          lineHeight: 'var(--typescale-headline-large-line-height)',
          letterSpacing: 'var(--typescale-headline-large-tracking)',
          fontWeight: 'var(--typescale-headline-large-weight)',
        }],
        'headline-medium': ['var(--typescale-headline-medium-size)', {
          lineHeight: 'var(--typescale-headline-medium-line-height)',
          letterSpacing: 'var(--typescale-headline-medium-tracking)',
          fontWeight: 'var(--typescale-headline-medium-weight)',
        }],
        'headline-small': ['var(--typescale-headline-small-size)', {
          lineHeight: 'var(--typescale-headline-small-line-height)',
          letterSpacing: 'var(--typescale-headline-small-tracking)',
          fontWeight: 'var(--typescale-headline-small-weight)',
        }],

        // Title styles
        'title-large': ['var(--typescale-title-large-size)', {
          lineHeight: 'var(--typescale-title-large-line-height)',
          letterSpacing: 'var(--typescale-title-large-tracking)',
          fontWeight: 'var(--typescale-title-large-weight)',
        }],
        'title-medium': ['var(--typescale-title-medium-size)', {
          lineHeight: 'var(--typescale-title-medium-line-height)',
          letterSpacing: 'var(--typescale-title-medium-tracking)',
          fontWeight: 'var(--typescale-title-medium-weight)',
        }],
        'title-small': ['var(--typescale-title-small-size)', {
          lineHeight: 'var(--typescale-title-small-line-height)',
          letterSpacing: 'var(--typescale-title-small-tracking)',
          fontWeight: 'var(--typescale-title-small-weight)',
        }],

        // Label styles
        'label-large': ['var(--typescale-label-large-size)', {
          lineHeight: 'var(--typescale-label-large-line-height)',
          letterSpacing: 'var(--typescale-label-large-tracking)',
          fontWeight: 'var(--typescale-label-large-weight)',
        }],
        'label-medium': ['var(--typescale-label-medium-size)', {
          lineHeight: 'var(--typescale-label-medium-line-height)',
          letterSpacing: 'var(--typescale-label-medium-tracking)',
          fontWeight: 'var(--typescale-label-medium-weight)',
        }],
        'label-small': ['var(--typescale-label-small-size)', {
          lineHeight: 'var(--typescale-label-small-line-height)',
          letterSpacing: 'var(--typescale-label-small-tracking)',
          fontWeight: 'var(--typescale-label-small-weight)',
        }],

        // Body styles
        'body-large': ['var(--typescale-body-large-size)', {
          lineHeight: 'var(--typescale-body-large-line-height)',
          letterSpacing: 'var(--typescale-body-large-tracking)',
          fontWeight: 'var(--typescale-body-large-weight)',
        }],
        'body-medium': ['var(--typescale-body-medium-size)', {
          lineHeight: 'var(--typescale-body-medium-line-height)',
          letterSpacing: 'var(--typescale-body-medium-tracking)',
          fontWeight: 'var(--typescale-body-medium-weight)',
        }],
        'body-small': ['var(--typescale-body-small-size)', {
          lineHeight: 'var(--typescale-body-small-line-height)',
          letterSpacing: 'var(--typescale-body-small-tracking)',
          fontWeight: 'var(--typescale-body-small-weight)',
        }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      height: {
        38: "9.5rem",
        4.5: "1.125rem",
      },
      inset: { unset: "unset" },
      letterSpacing: { 42: '0.042em' },
      maxWidth: { 42: "10.5rem", },
      minWidth: { 4.5: "1.125rem", 75: "18.75rem", 50: "12.5rem" },
      opacity: {
        '4': '0.04',
        '8': '0.08',
        '12': '0.12',
        '16': '0.16',
        '38': '0.38',
        '88': '0.88',
        '92': '0.92',
        'dragged-state-layer-opacity': 'var(--state-dragged-state-layer-opacity, 0.16)',
        'focus-state-layer-opacity': 'var(--state-focus-state-layer-opacity, 0.12)',
        'hover-state-layer-opacity': 'var(--state-hover-state-layer-opacity, 0.08)',
        'pressed-state-layer-opacity': 'var(--state-pressed-state-layer-opacity, 0.12)',
      },
      outlineWidth: { 3: '3px' },
      ringWidth: {
        '3': '3px',
      },
      width: { 4.5: "1.125rem", 70: "17.5rem" },
      animation: {
        "checkmark-draw": "checkmark-draw 150ms var(--motion-easing-standard) forwards",
        'outward-grow': 'outward-grow 125ms cubic-bezier(0.3,0,0,1)',
        'outward-shrink': 'outward-shrink 375ms cubic-bezier(0.3,0,0,1)',
        'inward-grow': 'inward-grow 125ms cubic-bezier(0.3,0,0,1)',
        'inward-shrink': 'inward-shrink 375ms cubic-bezier(0.3,0,0,1)',
        ripple: 'ripple 450ms cubic-bezier(0.2, 0, 0, 1)'
      },
      keyframes: {
        "checkmark-draw": {
          from: {
            strokeDasharray: "29.7833385",
            strokeDashoffset: "29.7833385",
          },
          to: {
            strokeDasharray: "29.7833385",
            strokeDashoffset: "0",
          },
        },
        "outline-in": {
          "0%": {
            outlineWidth: "8px",
          },
          "100%": {
            outlineWidth: "3px",
          }
        },
        'outward-grow': {
          'from': {
            'outline-width': '0'
          },
          'to': {
            'outline-width': '8px'
          }
        },
        'outward-shrink': {
          'from': {
            'outline-width': '8px'
          },
          'to': {
            'outline-width': '3px'
          }
        },
        'inward-grow': {
          'from': {
            'border-width': '0'
          },
          'to': {
            'border-width': '8px'
          }
        },
        'inward-shrink': {
          'from': {
            'border-width': '8px'
          },
          'to': {
            'border-width': '3px'
          }
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0.12'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0'
          }
        },
      },
      transitionDelay: { 15: "15ms" },
      transitionDuration: {
        15: "15ms",
        105: "105ms",
        375: "375ms",
        'short-1': 'var(--motion-duration-short-1, 50ms)',
        'short-2': 'var(--motion-duration-short-2, 100ms)',
        'short-3': 'var(--motion-duration-short-3, 150ms)',
        'short-4': 'var(--motion-duration-short-4, 200ms)',
        'medium-1': 'var(--motion-duration-medium-1, 250ms)',
        'medium-2': 'var(--motion-duration-medium-2, 300ms)',
        'medium-3': 'var(--motion-duration-medium-3, 350ms)',
        'medium-4': 'var(--motion-duration-medium-4, 400ms)',
        'long-1': 'var(--motion-duration-long-1, 450ms)',
        'long-2': 'var(--motion-duration-long-2, 500ms)',
        'long-3': 'var(--motion-duration-long-3, 550ms)',
        'long-4': 'var(--motion-duration-long-4, 600ms)',
        'extra-long-1': 'var(--motion-duration-extra-long-1, 700ms)',
        'extra-long-2': 'var(--motion-duration-extra-long-2, 800ms)',
        'extra-long-3': 'var(--motion-duration-extra-long-3, 900ms)',
        'extra-long-4': 'var(--motion-duration-extra-long-4, 1000ms)',
      },
      transitionTimingFunction: {
        'linear': 'var(--motion-easing-linear,cubic-bezier(0, 0, 1, 1))',
        'standard': 'var(--motion-easing-standard,cubic-bezier(0.2, 0, 0, 1))',
        'standard-accelerate': 'var(--motion-easing-standard-accelerate,cubic-bezier(0.3, 0, 1, 1))',
        'standard-decelerate': 'var(--motion-easing-standard-decelerate,cubic-bezier(0, 0, 0, 1))',
        'emphasized': 'var(--motion-easing-emphasized,cubic-bezier(0.2, 0, 0, 1))',
        'emphasized-accelerate': 'var(--motion-easing-emphasized-accelerate,cubic-bezier(0.3, 0, 0.8, 0.15))',
        'emphasized-decelerate': 'var(--motion-easing-emphasized-decelerate,cubic-bezier(0.05, 0.7, 0.1, 1))',
      },
      transitionProperty: {
        'width': 'width',
        'opacity': 'opacity',
        'width-opacity': 'width, opacity',
        'opacity-transform': 'opacity, transform',
      },
      zIndex: { 1: '1' },
    }
  },
  plugins: [require("tailwindcss-animate"), plugin(function ({ addUtilities }) {
    addUtilities({
      '.no-transition': {
        '&, & *': {
          transition: 'none !important',
        }
      },
      '.ranged input.start': {
        'clip-path': 'inset(0 calc(100% - (var(--_state-layer-size, 40px) / 2 + (100% - var(--_state-layer-size, 40px)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))) 0 0)',
      },
      '.ranged input.end': {
        'clip-path': 'inset(0 0 0 calc(var(--_state-layer-size, 40px) / 2 + (100% - var(--_state-layer-size, 40px)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)))',
      },
      '.ranged input.start:dir(rtl)': {
        'clip-path': 'inset(0 0 0 calc(100% - (var(--_state-layer-size, 40px) / 2 + (100% - var(--_state-layer-size, 40px)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))))',
      },
      '.ranged input.end:dir(rtl)': {
        'clip-path': 'inset(0 calc(var(--_state-layer-size, 40px) / 2 + (100% - var(--_state-layer-size, 40px)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)) 0 0)',
      },
      '.handle-container': {
        'clip-path': 'inset(-12px)',
        'position': 'absolute',
        'inset': '0',
        'pointer-events': 'none',
        'z-index': '40',
        'width': '100%',
        'contain': 'layout',
        'margin': '0 10px',
        'left': '-10px',
        'overflow': 'visible',
      },
      '.handle-wrapper': {
        'position': 'absolute',
        'inset': '0',
        'height': '100%',
        'width': 'calc(100% - 20px)',
        'overflow': 'visible',
        'margin': '0 10px',
        'contain': 'none',
      },
      '.track-container': {
        'z-index': '10',
        'position': 'absolute',
        'width': '100%',
        'height': '4px',
        'pointer-events': 'auto',
      },
      '.track-active': {
        'z-index': '20',
        'position': 'absolute',
        'height': '100%',
        'pointer-events': 'none',
      }
    })
  })]
}
export default config