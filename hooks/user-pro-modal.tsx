import { create } from "zustand";

interface userModelStoreProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const userProModal = create<userModelStoreProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
