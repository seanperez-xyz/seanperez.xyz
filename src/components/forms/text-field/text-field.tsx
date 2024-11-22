import { component$, Slot } from "@builder.io/qwik";
import { cva, type VariantProps } from "class-variance-authority";
//
import { cn } from "~/utils";
import { TextFieldLabel } from "./text-field-label";
import { TextFieldIcon } from "./text-field-icon";
import { TextFieldAffix } from "./text-field-affix";
import { TextFieldInput } from "./text-field-input";
import { TextFieldSupportingText } from "./text-field-supporting-text";

const textFieldVariants = cva(
  [
    "group/field relative w-full inline-flex flex-col text-start cursor-text has-[input:disabled]:cursor-default",
  ],
  {
    variants: {
      variant: {
        outlined: [
          "rounded-sm mt-2",
          "ring-1 ring-outline",
          "[&:not(:focus-within)]:hover:ring-on-surface-variant",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent",
          "has-[input:disabled]:ring-on-surface/38",
          "[&:has([aria-invalid=true])]:ring-error",
          "[&:has([aria-invalid=true])]:focus-within:ring-2 [&:has([aria-invalid=true])]:focus-within:ring-error",
          "[&:has([aria-invalid=true])]:not(:focus-within):hover:ring-on-error-container",
        ],
        filled: [
          "rounded-t-sm",
          "bg-surface-container-highest",
          "border-b border-outline mb-[1px]",
          "[&:not(:focus-within)]:hover:border-b-on-surface-variant",
          "focus-within:border-b-2 focus-within:border-primary focus-within:mb-0",
          "has-[input:disabled]:border-on-surface/38",
          "[&:has([aria-invalid=true])]:border-b-error",
          "[&:has([aria-invalid=true])]:focus-within:border-b-2 [&:has([aria-invalid=true])]:focus-within:border-b-error",
          "[&:has([aria-invalid=true])]:not(:focus-within):hover:border-b-on-error-container",
          "has-[textarea]:pt-6 pt-4",
        ],
      },
      size: {
        default: "",
        small: "text-sm",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "default",
    },
  },
);

export interface TextFieldProps extends VariantProps<typeof textFieldVariants> {
  label?: string;
  error?: string;
  supportingText?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "textarea";
  placeholder?: string;
  rows?: number;
  prefixText?: string;
  suffixText?: string;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  class?: string;
}

export const TextField = component$<TextFieldProps>((props) => {
  const {
    disabled,
    required,
    error,
    hasLeadingIcon,
    hasTrailingIcon,
    name,
    label,
    supportingText,
    variant = "outlined",
    size,
    prefixText,
    suffixText,
    value,
    class: className,
    ...inputProps
  } = props;
  const isTextArea = "rows" in props || props.type === "textarea";
  return (
    <div class="my-2 flex flex-col">
      <div class={cn(textFieldVariants({ variant, size }), className)}>
        {prefixText && <TextFieldAffix type="prefix" text={prefixText} />}

        <TextFieldInput
          {...inputProps}
          type={props.type === "textarea" ? "textarea" : props.type}
          disabled={disabled}
          required={required}
          error={error}
          hasLeadingIcon={hasLeadingIcon}
          hasTrailingIcon={hasTrailingIcon}
          name={name}
          value={value}
          variant={variant}
          placeholder=" "
        />

        {suffixText && <TextFieldAffix type="suffix" text={suffixText} />}

        <TextFieldLabel
          label={label}
          required={required}
          variant={variant}
          size={size}
          type={isTextArea ? "textarea" : "input"}
        />

        {hasLeadingIcon && (
          <TextFieldIcon position="leading">
            <Slot name="leading-icon" />
          </TextFieldIcon>
        )}

        {hasTrailingIcon && (
          <TextFieldIcon position="trailing">
            <Slot name="trailing-icon" />
          </TextFieldIcon>
        )}
      </div>
      <TextFieldSupportingText
        error={error}
        supportingText={supportingText}
        name={name}
      />
    </div>
  );
});
