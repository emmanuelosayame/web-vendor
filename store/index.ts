import { create } from "zustand";
import { devtools, combine, persist } from "zustand/middleware";
import type { ColorSchemeSlice } from "types/shared";
import { colorSchemeSlice } from "./colorSchemeSlice";

export const useStore = create<ColorSchemeSlice>()(
  persist(
    (...args) => ({
      ...colorSchemeSlice(...args),
    }),
    {
      name: "color-scheme",
      partialize: (state) => ({ colorScheme: state.colorScheme }),
    }
  )
);
