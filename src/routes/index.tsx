import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1 class="text-4xl font-bold text-primary md:text-6xl lg:text-8xl">
        Sean Perez
      </h1>
    </>
  );
});

export const head: DocumentHead = {
  title: "SeanPerez.xyz",
  meta: [
    {
      name: "description",
      content: "Sean Perez's web portfolio and projects",
    },
    {
      property: "og:image",
      content: "https://seanperez.xyz/og-image",
    },
  ],
};
