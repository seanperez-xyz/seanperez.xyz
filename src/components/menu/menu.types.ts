import type { QRL } from "@builder.io/qwik";
import type { Corner, FocusState } from './shared';

export interface MenuProps {
  /**
   * Opens the menu and makes it visible
   */
  open?: boolean;

  /**
   * Skips the opening and closing animations
   */
  quick?: boolean;

  /**
   * Whether the positioning algorithm should calculate relative to the parent
   * of the anchor element (`absolute`), relative to the window (`fixed`), or
   * relative to the document (`document`). `popover` will use the popover API.
   */
  positioning?: 'absolute' | 'fixed' | 'document' | 'popover';

  /**
   * The corner of the anchor which to align the menu
   */
  anchorCorner?: Corner;

  /**
   * The corner of the menu which to align to the anchor
   */
  menuCorner?: Corner;

  /**
   * Displays overflow content like a submenu
   */
  hasOverflow?: boolean;

  /**
   * Keeps the menu open when clicking outside
   */
  stayOpenOnOutsideClick?: boolean;

  /**
   * Keeps the menu open when focus leaves the menu
   */
  stayOpenOnFocusout?: boolean;

  /**
   * The element to focus by default when opened
   */
  defaultFocus?: FocusState;

  /**
   * Offsets the menu's inline alignment from the anchor
   */
  xOffset?: number;

  /**
   * Offsets the menu's block alignment from the anchor
   */
  yOffset?: number;

  /**
   * Called when an item is selected
   */
  onSelect$?: QRL<(item: HTMLElement) => void>;
}