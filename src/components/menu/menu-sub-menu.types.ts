import type { PropsOf } from "@builder.io/qwik";
import type { Corner } from "./shared";

export interface MenuSubMenuProps extends PropsOf<'li'> {
    /**
     * The anchorCorner to set on the submenu.
     */
    anchorCorner?: Corner;
    /**
     * The menuCorner to set on the submenu.
     */
    menuCorner?: Corner;
    /**
     * The delay between mouseenter and submenu opening.
     */
    hoverOpenDelay?: number;
    /**
     * The delay between pointerleave and the submenu closing.
     */
    hoverCloseDelay?: number;
}