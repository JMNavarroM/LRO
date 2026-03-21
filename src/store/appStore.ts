import { create } from 'zustand'
import type { ModuleId } from '../types'

interface AppStore {
  activeModule: ModuleId
  sidebarCollapsed: boolean
  setActiveModule: (id: ModuleId) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeModule: 'dashboard',
  sidebarCollapsed: false,
  setActiveModule: (id) => set({ activeModule: id }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
