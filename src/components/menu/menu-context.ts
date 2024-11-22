import { createContextId, type QRL } from "@builder.io/qwik";
import type { Corner, FocusState } from "./shared";

export interface MenuState {
    isOpen: boolean;
    position: {
        top: string;
        left: string;
        position: string;
        transform: string;
    };
    focusedItemIndex: number;
    items: HTMLElement[];
    defaultFocus: FocusState;
    anchorCorner: Corner;
    menuCorner: Corner;
    quick: boolean;
    selectedItem?: HTMLElement;
    timeoutId?: number;
    menuRef?: HTMLElement;
    anchorRef?: HTMLElement;
}

export interface MenuContextValue {
    state: MenuState;
    show: QRL<() => void>;
    hide: QRL<() => void>;
    toggle: QRL<() => void>;
    registerItem: QRL<(item: HTMLElement) => void>;
    unregisterItem: QRL<(item: HTMLElement) => void>;
    selectItem: QRL<(item: HTMLElement) => void>;
    setTimeout: QRL<(fn: () => void, delay: number) => void>;
    clearTimeout: QRL<() => void>;
}

export const MenuContext = createContextId<MenuContextValue>("MenuContext");