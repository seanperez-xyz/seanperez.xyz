import type { ClassList, PropsOf } from "@builder.io/qwik";
import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { codeToHtml } from "shiki";
import { CopyCodeButton } from "~/components/copy-code-button";
import { cn } from "~/utils";

export type HighlightProps = PropsOf<"div"> & {
  code: string;
  copyCodeClass?: ClassList;
  language?: "tsx" | "html" | "css";
  splitCommentStart?: string;
  splitCommentEnd?: string;
};

export const Highlight = component$(
  ({
    code,
    copyCodeClass,
    language = "tsx",
    splitCommentStart = "{/* start */}",
    splitCommentEnd = "{/* end */}",
    ...props
  }: HighlightProps) => {
    const codeSig = useSignal("");

    const addShiki$ = $(async () => {
      let modifiedCode: string = code;

      let partsOfCode = modifiedCode.split(splitCommentStart);

      if (partsOfCode.length > 1) {
        modifiedCode = partsOfCode[1];
      }

      partsOfCode = modifiedCode.split(splitCommentEnd);

      if (partsOfCode.length > 1) {
        modifiedCode = partsOfCode[0];
      }

      const str = await codeToHtml(modifiedCode, {
        lang: language,
        theme: "poimandres",
      });

      codeSig.value = str.toString();
    });

    useTask$(async ({ track }) => {
      track(() => code);
      await addShiki$();
    });

    return (
      <div class="code-example relative max-h-[31.25rem] rounded-none">
        <CopyCodeButton
          class={[
            "absolute right-3 top-3 text-white hover:bg-slate-800 hover:text-white",
            copyCodeClass,
          ]}
          code={code}
        />
        <div
          {...props}
          class={cn(
            "tab-size dark:to-accent/30 max-h-[31.25rem] max-w-full overflow-auto rounded-sm bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-sm dark:from-background",
            props.class,
          )}
        >
          <div dangerouslySetInnerHTML={codeSig.value} />
        </div>
      </div>
    );
  },
);
