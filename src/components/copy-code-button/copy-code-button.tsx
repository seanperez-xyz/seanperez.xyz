import {
  $,
  component$,
  Slot,
  useSignal,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import type { PropsOf } from "@builder.io/qwik";
import { CheckMarkIcon, CopyIcon } from "../theme-toggle/icons";
import styles from "./copy-code-button.css?inline";
import { IconButton } from "~/components/icon-button";

interface CopyCodeButtonProps extends PropsOf<"span"> {
  /**
   * The aria label for the copy button when it has not been clicked.
   */
  label?: string;

  /**
   * The aria label for the copy button when it has been clicked and the copy is
   * successful.
   */
  successLabel?: string;

  /**
   * The title to be set on the copy button.
   */
  buttonTitle?: string;
  code?: string;
}

export const CopyCodeButton = component$<CopyCodeButtonProps>(
  ({
    label = "Copy code",
    successLabel = "Copied to clipboard",
    buttonTitle = "Copy to clipboard",
    class: className,
    code,
    ...props
  }) => {
    useStyles$(styles);
    const showCheckMark = useSignal(false);
    const codeRef = useSignal<HTMLElement>();

    const onClick$ = $(async () => {
      let textToCopy = "";

      if (code) {
        textToCopy = code;
      } else if (codeRef.value) {
        textToCopy = codeRef.value.innerText || codeRef.value.textContent || "";
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        showCheckMark.value = true;
      } catch (err) {
        console.error(`Copy failed:`, err);
      }
    });

    useTask$(({ track, cleanup }) => {
      const isShowing = track(() => showCheckMark.value);

      if (isShowing) {
        const timeoutId = setTimeout(() => {
          showCheckMark.value = false;
        }, 3000);

        cleanup(() => clearTimeout(timeoutId));
      }
    });

    return (
      <span {...props} class={["copy-code-button", className]}>
        <pre>
          <code ref={codeRef}>
            <Slot />
          </code>
        </pre>
        <IconButton
          look="standard"
          rounded="full"
          class={[
            "absolute right-2 top-2",
            "text-on-surface",
            "hover:bg-on-surface/8 focus:bg-on-surface/12 active:bg-on-surface/16",
            "transition-colors duration-medium-2 ease-standard",
          ]}
          title={buttonTitle}
          aria-label={label}
          aria-label-selected={successLabel}
          bind:selected={showCheckMark}
          onClick$={onClick$}
          toggle
        >
          <CopyIcon />
          <CheckMarkIcon q:slot="selected" />
        </IconButton>
      </span>
    );
  },
);
