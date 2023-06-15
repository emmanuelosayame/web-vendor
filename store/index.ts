import { create } from "zustand";
import { devtools, combine, persist } from "zustand/middleware";
import type { ColorSchemeSlice, DefaultSlice } from "t/shared";
import { colorSchemeSlice } from "./colorSchemeSlice";
import { defaultSlice } from "./default";

export const useStore = create<ColorSchemeSlice & DefaultSlice>()(
  persist(
    (...args) => ({
      ...colorSchemeSlice(...args),
      ...defaultSlice(...args),
    }),
    {
      name: "color-scheme",
      partialize: (state) => ({ colorScheme: state.colorScheme }),
    }
  )
);
