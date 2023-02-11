import type { StateCreator } from "zustand";
import type { ColorSchemeSlice } from "types/shared";

export const colorSchemeSlice: StateCreator<ColorSchemeSlice> = (set, get) => ({
  colorScheme: "montery",
  setColorScheme: (name) => {
    set({
      colorScheme: name,
    });
  },
});
