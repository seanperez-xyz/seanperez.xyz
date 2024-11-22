export type Corner = 'start-start' | 'start-end' | 'end-start' | 'end-end';

export enum FocusState {
    NONE = 'none',
    LIST_ROOT = 'list-root',
    FIRST_ITEM = 'first-item',
    LAST_ITEM = 'last-item'
}

export enum NavigableKey {
    UP = 'ArrowUp',
    DOWN = 'ArrowDown',
    RIGHT = 'ArrowRight',
    LEFT = 'ArrowLeft',
    HOME = 'Home',
    END = 'End'
}

export enum SelectionKey {
    SPACE = 'Space',
    ENTER = 'Enter'
}

export enum CloseReason {
    CLICK_SELECTION = 'click-selection',
    KEYDOWN = 'keydown',
    FOCUSOUT = 'focusout',
    OUTSIDE_CLICK = 'outside-click'
}

export enum KeydownCloseKey {
    ESCAPE = 'Escape',
    SPACE = SelectionKey.SPACE,
    ENTER = SelectionKey.ENTER
}

export interface MenuItemMetadata {
    text: string;
    disabled: boolean;
    type: string;
}

export interface CloseMenuEvent extends CustomEvent<{
    initiator: HTMLElement;
    reason: {
        kind: CloseReason;
        key?: string;
    };
    itemPath: HTMLElement[];
}> { } 