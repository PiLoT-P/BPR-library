import { create } from "zustand";

interface PopupStore {
  stack: string[];

  openPopup: (id: string) => void;
  closePopup: (id: string) => void;

  isTopPopup: (id: string) => boolean;
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  stack: [],

  openPopup: (id) =>
    set((state) => ({
      stack: [...state.stack.filter((x) => x !== id), id],
    })),

  closePopup: (id) =>
    set((state) => ({
      stack: state.stack.filter((x) => x !== id),
    })),

  isTopPopup: (id) => {
    const stack = get().stack;

    return stack[stack.length - 1] === id;
  },
}));