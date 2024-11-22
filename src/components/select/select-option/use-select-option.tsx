import { useStore } from "@builder.io/qwik";

/**
 * Creates an event fired by a SelectOption to request selection from md-select.
 * Typically fired after `selected` changes from `false` to `true`.
 */
export function createRequestSelectionEvent() {
  return new Event("request-selection", {
    bubbles: true,
    composed: true,
  });
}

/**
 * Creates an event fired by a SelectOption to request deselection from
 * md-select. Typically fired after `selected` changes from `true` to `false`.
 */
export function createRequestDeselectionEvent() {
  return new Event("request-deselection", {
    bubbles: true,
    composed: true,
  });
}

/**
 * The options used to initialize SelectOptionController.
 */
export type SelectOptionConfig = MenuItemControllerConfig;

/**
 * A controller that provides most functionality and md-select compatibility for
 * an element that implements the SelectOption interface.
 */
export interface SelectOptionController  {
  readonly menuItemController: MenuItemController;
  internalDisplayText: string | null;
  lastSelected: boolean;
  firstUpdate :boolean
}
export function useSelectOptionController({
    menuItemController,
    internalDisplayText=null,
    lastSelected,
    firstUpdate =true,
}: SelectOptionConfig) {
const state = useStore({
    internalDisplayText,
    menuItemController,
  /**
   * The recommended role of the select option.
   */
  getRole() {
    return this.menuItemController.role;
  }

  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot, and if there are
   * no slotted elements into headline, then it checks the _default_ slot, and
   * then the `"supporting-text"` slot if nothing is in _default_.
   */
  getTypeaheadText() {
    return this.menuItemController.typeaheadText;
  }

  setTypeaheadText(text: string) {
    this.menuItemController.setTypeaheadText(text);
  }

  /**
   * The text that is displayed in the select field when selected. If not set,
   * defaults to the textContent of the item slotted into the `"headline"` slot,
   * and if there are no slotted elements into headline, then it checks the
   * _default_ slot, and then the `"supporting-text"` slot if nothing is in
   * _default_.
   */
  getDisplayText() {
    if (internalDisplayText !== null) {
      return this.internalDisplayText;
    }

    return this.menuItemController.typeaheadText;
  }

  setDisplayText(text: string) {
    this.internalDisplayText = text;
  }

  /**
   * @param host The SelectOption in which to attach this controller to.
   * @param config The object that configures this controller's behavior.
   */
  
  host: selectOptionRef,
  config: SelectOptionConfig,
  lastSelected = this.host.selected;
  menuItemController = new MenuItemController(host, config);
  },

  hostUpdate() {
    if (this.lastSelected !== this.host.selected) {
      this.host.ariaSelected = this.host.selected ? "true" : "false";
    }
  },

  hostUpdated() {
    // Do not dispatch event on first update / boot-up.
    if (this.lastSelected !== this.host.selected && !this.firstUpdate) {
      // This section is really useful for when the user sets selected on the
      // option programmatically. Most other cases (click and keyboard) are
      // handled by md-select because it needs to coordinate the
      // single-selection behavior.
      if (this.host.selected) {
        this.host.dispatchEvent(createRequestSelectionEvent());
      } else {
        this.host.dispatchEvent(createRequestDeselectionEvent());
      }
    }

    this.lastSelected = this.host.selected;
    this.firstUpdate = false;
  },

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onClick: () => {
    this.menuItemController.onClick();
  },

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onKeydown: (e: KeyboardEvent) => {
    this.menuItemController.onKeydown(e);
  }
})
}
