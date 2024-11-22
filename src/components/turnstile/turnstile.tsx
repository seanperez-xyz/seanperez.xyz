import type { QRL } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
// import { useTheme } from "~/components/theme-toggle/use-theme";

export interface TurnstileProps {
  siteKey: string;
  onVerify$?: QRL<(token: string) => void>;
  action?: string;
  size?: "normal" | "compact" | "invisible";
  appearance?: "always" | "execute" | "interaction-only";
  responseField?: boolean;
  responseFieldName?: string;
  retry?: "auto" | "never";
  retryInterval?: number;
  refreshExpired?: "auto" | "manual" | "never";
}

export const Turnstile = component$<TurnstileProps>(
  ({
    siteKey,
    onVerify$,
    action,
    size = "normal",
    appearance = "always",
    responseField = true,
    responseFieldName = "cf-turnstile-response",
    retry = "auto",
    retryInterval = 8000,
    refreshExpired = "auto",
  }) => {
    // const { state } = useTheme();
    const resolvedMode = useSignal<"light" | "dark">("dark");

    return (
      <div
        class="cf-turnstile"
        data-sitekey={siteKey}
        data-theme={resolvedMode.value}
        data-action={action}
        data-size={size}
        data-appearance={appearance}
        data-response-field={responseField}
        data-response-field-name={responseFieldName}
        data-retry={retry}
        data-retry-interval={retryInterval}
        data-refresh-expired={refreshExpired}
        data-callback={(token: string) => onVerify$?.(token)}
      />
    );
  },
);
