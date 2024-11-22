import type { QRL } from '@builder.io/qwik';
import { createContextId } from '@builder.io/qwik';

export interface NavigationContextValue {
    activeIndex: number;
    hideInactiveLabels?: boolean;
    tabs: Array<{
        index: number;
        active: boolean;
    }>;
    registerTab: QRL<(this: NavigationContextValue, index: number) => void>;
}

export const NavigationContext = createContextId<NavigationContextValue>('navigation-context');