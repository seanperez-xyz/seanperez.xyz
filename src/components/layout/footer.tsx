import { component$ } from "@builder.io/qwik";
import { LuHome, LuPenSquare, LuSettings, LuUser } from "@qwikest/icons/lucide";
import * as NavigationBar from "~/components/navigation";

export const Footer = component$(() => {
  return (
    <footer class="relative flex h-full w-full items-end justify-center md:hidden">
      <NavigationBar.Root hideInactiveLabels={false} initialActiveIndex={0}>
        <NavigationBar.Tab index={0} label="Home">
          <LuHome q:slot="icon" class="h-6 w-6" />
        </NavigationBar.Tab>
        <NavigationBar.Tab index={1} label="Contact">
          <LuPenSquare q:slot="icon" class="h-6 w-6" />
        </NavigationBar.Tab>

        <NavigationBar.Tab index={2} label="Profile" badgeValue="2">
          <LuUser q:slot="icon" class="h-6 w-6" />
        </NavigationBar.Tab>

        <NavigationBar.Tab index={3} label="Settings">
          <LuSettings q:slot="icon" class="h-6 w-6" />
        </NavigationBar.Tab>
      </NavigationBar.Root>
    </footer>
  );
});
