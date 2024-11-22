import { $, useSignal } from "@builder.io/qwik";
import { NavigableKey, SelectionKey, KeydownCloseKey } from "./shared";

export const useKeyboardNavigation = () => {
    const currentIndex = useSignal(-1);

    const handleNavigation = $((event: KeyboardEvent, items: HTMLElement[]) => {
        if (event.defaultPrevented || !items.length) return;

        let newIndex = currentIndex.value;
        const isRtl = document.dir === 'rtl';

        switch (event.code) {
            case NavigableKey.DOWN:
                newIndex = Math.min(currentIndex.value + 1, items.length - 1);
                break;
            case NavigableKey.UP:
                newIndex = Math.max(currentIndex.value - 1, 0);
                break;
            case NavigableKey.HOME:
                newIndex = 0;
                break;
            case NavigableKey.END:
                newIndex = items.length - 1;
                break;
            case NavigableKey.RIGHT:
                if (!isRtl) {
                    // Handle submenu open
                    const currentItem = items[currentIndex.value];
                    if (currentItem.hasAttribute('aria-haspopup')) {
                        currentItem.click();
                        return;
                    }
                }
                break;
            case NavigableKey.LEFT:
                if (isRtl) {
                    // Handle submenu open
                    const currentItem = items[currentIndex.value];
                    if (currentItem.hasAttribute('aria-haspopup')) {
                        currentItem.click();
                        return;
                    }
                }
                break;
            case SelectionKey.ENTER:
            case SelectionKey.SPACE:
                if (currentIndex.value >= 0) {
                    items[currentIndex.value]?.click();
                }
                break;
            case KeydownCloseKey.ESCAPE:
                return { close: true };
            default:
                return;
        }

        if (newIndex !== currentIndex.value) {
            currentIndex.value = newIndex;
            items[newIndex]?.focus();
        }
    });

    return {
        currentIndex,
        handleNavigation
    };
};