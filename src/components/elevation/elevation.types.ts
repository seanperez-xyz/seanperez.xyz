export interface ElevationProps {
    /**
     * The elevation level (0-5)
     * - level0: 0dp - no elevation
     * - level1: 1dp - subtle elevation for cards
     * - level2: 3dp - medium elevation for raised buttons
     * - level3: 6dp - high elevation for floating action buttons
     * - level4: 8dp - emphasized elevation for dialogs
     * - level5: 12dp - maximum elevation for bottom sheets
     */
    level?: 0 | 1 | 2 | 3 | 4 | 5;
}