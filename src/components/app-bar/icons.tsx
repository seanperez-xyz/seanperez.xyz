import { component$, type PropsOf } from "@builder.io/qwik";

export const MenuOpenIcon = component$<PropsOf<"svg">>(({ key, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
    key={key}
  >
    <path
      fill="#888888"
      d="M3 18v-2h13v2zm16.6-1l-5-5l5-5L21 8.4L17.4 12l3.6 3.6zM3 13v-2h10v2zm0-5V6h13v2z"
    ></path>
  </svg>
));

export const MenuIcon = component$<PropsOf<"svg">>(({ key, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
    key={key}
  >
    <path fill="#888888" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z"></path>
  </svg>
));
