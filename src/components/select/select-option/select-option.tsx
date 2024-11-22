import type { MenuItem } from "~/components/menu";

import type { SelectOptionController } from "./use-select-option";
import type { JSXOutput, PropsOf } from "@builder.io/qwik";
import {
  $,
  component$,
  Slot,
  useContext,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { cn } from "~/utils";

/**
 * The interface specific to a Select Option
 */
interface SelectOptionSelf {
  /**
   * The form value associated with the Select Option. (Note: the visual portion
   * of the SelectOption is the headline defined in ListItem)
   */
  value: string;
  /**
   * Whether or not the SelectOption is selected.
   */
  selected: boolean;
  /**
   * The text to display in the select when selected. Defaults to the
   * textContent of the Element slotted into the headline.
   */
  displayText: string;
}

/**
 * The interface to implement for a select option. Additionally, the element
 * must have `md-list-item` and `md-menu-item` attributes on the host.
 */
export type SelectOptionProps = SelectOptionSelf & PropsOf<"menu">;

/**
 * @fires close-menu {CustomEvent<{initiator: SelectOption, reason: Reason, itemPath: SelectOption[]}>}
 * Closes the encapsulating menu on closable interaction. --bubbles --composed
 * @fires request-selection {Event} Requests the parent md-select to select this
 * element (and deselect others if single-selection) when `selected` changed to
 * `true`. --bubbles --composed
 * @fires request-deselection {Event} Requests the parent md-select to deselect
 * this element when `selected` changed to `false`. --bubbles --composed
 */
export const SelectOption = component$<SelectOptionProps>(
  ({
    /**
     * Disables the item and makes it non-selectable and non-interactive.
     */
    disabled = false,

    /**
     * READONLY: self-identifies as a menu item and sets its identifying attribute
     */
    isMenuItem = true,

    /**
     * Sets the item in the selected visual state when a submenu is opened.
     */
    selected = false,
    /**
     * Form value of the option.
     */
    value = "",
    ...props
  }) => {
    const listItemRoot = useSignal<HTMLElement>();
    const headlineElements = useSignal<HTMLElement[]>();
    const supportingTextElements = useSignal<HTMLElement[]>();

    /**
     * The text that is selectable via typeahead. If not set, defaults to the
     * innerText of the item slotted into the `"headline"` slot.
     */
    const controller = useStore({
      getTypeaheadText: $(function () {
        return this.selectOptionController.typeaheadText;
      }),
      setTypeaheadText: $(function (text: string) {
        this.selectOptionController.setTypeaheadText(text);
      }),
      setDisplayText: $(function (text: string) {
        this.selectOptionController.setDisplayText(text);
      }),
      /**
       * The text that is displayed in the select field when selected. If not set,
       * defaults to the textContent of the item slotted into the `"headline"` slot.
       */
      getDisplayText: $(function () {
        return this.selectOptionController.displayText;
      }),
    });

    const selectOptionController = useStore<SelectOptionController>({
      getHeadlineElements: $(function () {
        return this.headlineElements;
      }),
      getSupportingTextElements: $(function () {
        return this.supportingTextElements;
      }),
      getDefaultElements: $(function () {
        return this.defaultElements;
      }),
      getInteractiveElement: $(function () {
        return this.listItemRoot;
      }),
    });

    return (
      <ListItem>
        <Slot />
        <Slot name="start" />
        <Body />
        <Slot name="end" />
      </ListItem>
    );
  },
);

/**
 * Renders the root list item.
 *
 * @param content the child content of the list item.
 */
const ListItem = component$<PropsOf<"li"> & { content: JSXOutput }>(
  ({ class: className, content }) => {
    const ctx = useContext(SelectContext);
    return (
      <li
        id="item"
        tabIndex={disabled ? -1 : 0}
        role={selectOptionController.role}
        aria-label={ariaLabel}
        aria-selected={ariaSelected}
        aria-checked={ariaChecked}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        class={cn("list-item", className)}
        onClick$={ctx.selectOptionController.onClick}
        onKeydown$={ctx.selectOptionController.onKeydown}
      >
        {content}
      </li>
    );
  },
);
/**
 * Handles rendering the headline and supporting text.
 */
const Body = component$(() => {
  return (
    <>
      <Slot />
      <Slot name="overline" />
      <Slot name="headline" />
      <Slot name="supporting-text" />
      <Slot name="trailing-supporting-text" />
    </>
  );
});
