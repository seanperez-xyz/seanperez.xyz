import { $, useSignal, useStore } from '@builder.io/qwik';
import type { Corner } from './shared';

export interface MenuPosition {
    anchorCorner: Corner;
    menuCorner: Corner;
    xOffset: number;
    yOffset: number;
    positioning: 'absolute' | 'fixed' | 'document' | 'popover';
}

interface PositionStyles {
    position: 'fixed' | 'absolute';
    top: string;
    left: string;
    transform: string;
}

export const useMenuPosition = (props: MenuPosition) => {
    const anchorEl = useSignal<HTMLElement>();
    const menuEl = useSignal<HTMLElement>();

    const position = useStore({
        styles: {
            position: props.positioning === 'document' || props.positioning === 'popover'
                ? 'fixed'
                : 'absolute',
            top: '0',
            left: '0',
            transform: 'none'
        } satisfies PositionStyles
    });

    const updatePosition = $(() => {
        if (!menuEl.value || !anchorEl.value) return;

        const anchorRect = anchorEl.value.getBoundingClientRect();
        const menuRect = menuEl.value.getBoundingClientRect();

        let { top, left } = calculatePosition(
            anchorRect,
            menuRect,
            props.anchorCorner,
            props.menuCorner
        );

        // Apply offsets
        top += props.yOffset;
        left += props.xOffset;

        position.styles = {
            position: props.positioning === 'document' || props.positioning === 'popover'
                ? 'fixed'
                : 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transform: 'none'
        };
    });

    return {
        position,
        updatePosition,
        anchorEl,
        menuEl
    };
};

function calculatePosition(
    anchorRect: DOMRect,
    menuRect: DOMRect,
    anchorCorner: Corner,
    menuCorner: Corner
) {
    let top = 0;
    let left = 0;

    // Calculate initial position based on anchor corner
    switch (anchorCorner) {
        case 'start-start':
            top = anchorRect.top;
            left = anchorRect.left;
            break;
        case 'start-end':
            top = anchorRect.top;
            left = anchorRect.right;
            break;
        case 'end-start':
            top = anchorRect.bottom;
            left = anchorRect.left;
            break;
        case 'end-end':
            top = anchorRect.bottom;
            left = anchorRect.right;
            break;
    }

    // Adjust based on menu corner
    switch (menuCorner) {
        case 'start-start':
            break;
        case 'start-end':
            left -= menuRect.width;
            break;
        case 'end-start':
            top -= menuRect.height;
            break;
        case 'end-end':
            top -= menuRect.height;
            left -= menuRect.width;
            break;
    }

    return { top, left };
}
