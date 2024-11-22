import { $, useSignal, useStore } from "@builder.io/qwik";
import { DEFAULT_TYPEAHEAD_BUFFER_TIME } from "./constants";

export interface TypeaheadState {
    bufferText: string;
    lastKeyTime: number;
    active: boolean;
}

export const useTypeahead = (bufferTime = DEFAULT_TYPEAHEAD_BUFFER_TIME) => {
    const state = useStore<TypeaheadState>({
        bufferText: "",
        lastKeyTime: 0,
        active: true
    });

    const matchingItem = useSignal<HTMLElement>();

    const handleKeydown = $((event: KeyboardEvent, items: HTMLElement[]) => {
        if (!state.active) return;

        const isCharacterKey = event.key.length === 1;
        if (!isCharacterKey) return;

        const currentTime = performance.now();

        if (currentTime - state.lastKeyTime > bufferTime) {
            state.bufferText = "";
        }

        state.lastKeyTime = currentTime;
        state.bufferText += event.key.toLowerCase();

        // Find matching item
        matchingItem.value = items.find(item => {
            const text = item.textContent?.toLowerCase() || "";
            return text.startsWith(state.bufferText);
        });

        if (matchingItem.value) {
            matchingItem.value.focus();
        }
    });

    return {
        state,
        matchingItem,
        handleKeydown
    };
}; 