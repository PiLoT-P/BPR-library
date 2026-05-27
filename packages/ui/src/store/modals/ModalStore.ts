import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalStore {
  modals: number[];
  addModal: (id: number) => void;
  removeModal: (id: number) => void;
  isTopModal: (id: number) => boolean;
  getModalIndex: (id: number) => number;
}

export const useModalStore = create<ModalStore>()(
  devtools((set, get) => ({
    modals: [],
    addModal: (id: number) => set((state) => ({
      modals: state.modals.includes(id) ? state.modals : [...state.modals, id],
    })),
    removeModal: (id: number) => set((state) => ({
      modals: state.modals.filter((modalId) => modalId !== id),
    })),
    isTopModal: (id: number) => {
      const { modals } = get();
      return modals.length > 0 && modals[modals.length - 1] === id;
    },
    getModalIndex: (modalId) => get().modals.indexOf(modalId),
  }), {
    enabled: false,
    name: 'Modal store',
    trace: true,
  }),
)
