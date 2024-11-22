import { component$, useSignal } from "@builder.io/qwik";
import { Link, useContent } from "@builder.io/qwik-city";
import { LuPalette } from "@qwikest/icons/lucide";
import { AppBar } from "~/components/app-bar/app-bar";
import { IconButton } from "~/components/icon-button/icon-button";

export const Header = component$(() => {
  const { menu } = useContent();
  const menuOpen = useSignal(false);

  return (
    <AppBar variant="small">
      <div q:slot="home">
        <Link
          href="/"
          class="relative px-3 text-title-large text-primary no-underline outline-none"
        >
          Your App Name
        </Link>
      </div>

      <div q:slot="title" class="flex items-center gap-4">
        {menu?.items?.map((item, index) => (
          <Link
            key={index}
            class="text-title-medium font-medium"
            href={item.href}
          >
            {item.text}
          </Link>
        ))}
      </div>

      <div q:slot="trailing" class="relative">
        <IconButton
          onClick$={() => (menuOpen.value = !menuOpen.value)}
          title="Page theme controls"
          aria-label="Page theme controls"
          aria-haspopup="dialog"
          aria-expanded={menuOpen.value}
        >
          <LuPalette />
        </IconButton>
        {menuOpen.value && (
          <menu class="absolute right-0 top-full z-50 mt-2">
            theme changer here
          </menu>
        )}
      </div>
    </AppBar>
  );
});
