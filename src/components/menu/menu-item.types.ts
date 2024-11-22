import type { QRL } from "@builder.io/qwik";

export interface MenuItemProps {
    /**
   * Disables the item and makes it non-selectable
   */
    disabled?: boolean;

    /**
     * The type of menu item
     */
    type?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'link';

    /**
     * URL for link menu items
     */
    href?: string;

    /**
     * Target for link menu items
     */
    target?: '_blank' | '_self' | '_parent' | '_top';

    /**
     * Keeps menu open after selection
     */
    keepOpen?: boolean;

    /**
     * Shows item in selected state
     */
    selected?: boolean;

    /**
     * Called when this item is selected
     */
    onSelect$?: QRL<() => void>;
}