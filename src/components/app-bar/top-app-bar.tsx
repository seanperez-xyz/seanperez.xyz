import type { JSXOutput } from "@builder.io/qwik";
import {
  $,
  component$,
  Slot,
  useComputed$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { IconButton } from "../icon-button/icon-button";
import { GlobalStore } from "~/context";
import { MenuIcon, MenuOpenIcon } from "./icons";
import { Link } from "@builder.io/qwik-city";
import { Icon } from "../ui/icon";
import { LuPalette } from "@qwikest/icons/lucide";

export interface TopAppBarProps {
  logo?: JSXOutput;
  homeLabel?: string;
  github?: true | { user: string; repo: string };
}

export const TopAppBar = component$<TopAppBarProps>(
  ({ logo, homeLabel, github }) => {
    const ctx = useContext(GlobalStore);
    const menuOpen = useSignal(false);
    const inertContent = useSignal(false);
    // const inertSidebar = useSignal(false);
    // const themeButtonRef = useSignal<HTMLButtonElement>();

    const githubInfo = useComputed$(() =>
      github
        ? typeof github === "boolean"
          ? {
              user: import.meta.env.GITHUB_USER,
              repo: import.meta.env.GITHUB_REPO,
            }
          : github
        : undefined,
    );

    const onPaletteClick = $(() => {
      menuOpen.value = true;
      inertContent.value = true;
      ctx.sideMenuOpen = false;
      ctx.drawerOpen = false;
    });

    // const onMenuClosed = $(() => {
    //   menuOpen.value = false;
    //   inertContent.value = false;
    //   inertSidebar.value = false;
    // });

    // const onMenuOpened = $(() => {
    //   themeButtonRef.value?.focus();
    // });

    const onKeydown = $((e: KeyboardEvent) => {
      if (!e.defaultPrevented && e.key === "Escape") {
        e.preventDefault();
        menuOpen.value = false;
      }
    });

    const onMenuIconToggle = $((e: Event) => {
      const target = e.target as HTMLElement;
      ctx.drawerOpen = !target.hasAttribute("selected");
    });

    return (
      <header class="block h-20">
        <div class="default-content">
          <section class="start">
            <IconButton
              toggle
              class="menu-button"
              aria-label-selected="open navigation menu"
              aria-label="close navigation menu"
              aria-expanded={ctx.drawerOpen ? "false" : "true"}
              title={!ctx.drawerOpen ? "Open" : "Close" + " navigation menu"}
              onSelectedChange$={() => onMenuIconToggle}
            >
              <MenuIcon q:slot="selected" />
              <MenuOpenIcon />
            </IconButton>
            {logo && (
              <IconButton
                href="/"
                class="home-button"
                title="Home"
                aria-label="Home"
              >
                {logo}
              </IconButton>
            )}
          </section>

          <Link href="/" id="home-link" class="focus:ring">
            {homeLabel}
            <md-focus-ring for="home-link" />
          </Link>

          <Link id="skip-to-main" href="#main-content" tabIndex={0}>
            Skip to main content
          </Link>

          <section class="end">
            {githubInfo.value && (
              <IconButton
                title="GitHub repository"
                aria-label="GitHub repository"
                href={`https://github.com/${githubInfo.value.user}/${githubInfo.value.repo}`}
                target="_blank"
              >
                <Icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    />
                  </svg>
                </Icon>
              </IconButton>
            )}
            <IconButton
              onClick$={onPaletteClick}
              title="Page theme controls"
              aria-label="Page theme controls"
              aria-haspopup="dialog"
              aria-expanded={menuOpen.value ? "true" : "false"}
            >
              <LuPalette />
            </IconButton>
            <div
              role="dialog"
              aria-label="Page color theme controls"
              class={menuOpen.value ? "visible" : "hidden"}
              onKeyDown$={onKeydown}
            >
              {/* Theme controls content */}
            </div>
          </section>
        </div>
        <Slot />
      </header>
    );
  },
);

// const styles = `
//     :host,
//     header {
//       display: block;
//       height: var(--catalog-top-app-bar-height);
//     }

//     header {
//       position: fixed;
//       inset: 0 0 auto 0;
//       display: flex;
//       align-items: center;
//       box-sizing: border-box;
//       padding: var(--catalog-spacing-m) var(--catalog-spacing-l);
//       background-color: var(--md-sys-color-surface-container);
//       color: var(--md-sys-color-on-surface);
//       z-index: 12;
//     }

//     .default-content {
//       width: 100%;
//       display: flex;
//       align-items: center;
//     }

//     md-icon-button:not(:defined) {
//       width: 40px;
//       height: 40px;
//       display: flex;
//       visibility: hidden;
//     }

//     md-icon-button * {
//       display: block;
//     }

//     a {
//       color: var(--md-sys-color-primary);
//       font-size: max(var(--catalog-title-l-font-size), 22px);
//       text-decoration: none;
//       padding-inline: 12px;
//       position: relative;
//       outline: none;
//       vertical-align: middle;
//     }

//     .start .menu-button {
//       display: none;
//     }

//     .start .home-button * {
//       color: var(--md-sys-color-primary);
//     }

//     .end {
//       flex-grow: 1;
//       display: flex;
//       justify-content: flex-end;
//     }

//     #menu-island {
//       position: relative;
//     }

//     #skip-to-main {
//       padding: var(--catalog-spacing-s);
//       border-radius: var(--catalog-shape-m);
//       background-color: var(--md-sys-color-inverse-surface);
//       color: var(--md-sys-color-inverse-on-surface);
//       opacity: 0;
//       position: absolute;
//       pointer-events: none;
//     }

//     #skip-to-main:focus-visible {
//       opacity: 1;
//       pointer-events: auto;
//     }

//     @media (max-width: 1500px) {
//       .start .home-button {
//         display: none;
//       }

//       .start .menu-button {
//         display: flex;
//       }
//     }
//   `;

// declare global {
//   interface HTMLElementTagNameMap {
//     "top-app-bar": TopAppBar;
//   }
// }
