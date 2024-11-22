import { createContextId } from '@builder.io/qwik';

export interface SiteStore {
    headerMenuOpen: boolean;
    sideMenuOpen: boolean;
    drawerOpen: boolean;
}

export const GlobalStore = createContextId<SiteStore>('site-store');