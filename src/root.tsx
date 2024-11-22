import { component$, useContextProvider, useStore } from "@builder.io/qwik";
import { isDev } from "@builder.io/qwik/build";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
//
import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

import type { SiteStore } from "./context";
import { GlobalStore } from "./context";
import { ThemeProvider } from "./components/theme-toggle/theme-provider";

export default component$(() => {
  const store = useStore<SiteStore>({
    headerMenuOpen: false,
    sideMenuOpen: false,
    drawerOpen: false,
  });

  useContextProvider(GlobalStore, store);
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <ThemeProvider>
          <RouterOutlet />
        </ThemeProvider>
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
