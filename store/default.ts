import type { StateCreator } from "zustand";
import type { DefaultSlice } from "t/shared";

export const defaultSlice: StateCreator<DefaultSlice> = (set, get) => ({
  product: { pagn: 1 },
  setPagn: (no) => {
    set({
      product: { pagn: no },
    });
  },
});
