import { create } from 'zustand'

interface FunctionNavigationState {
  target: { contractAddress: string; functionName: string } | undefined
  navigateToFunction: (contractAddress: string, functionName: string) => void
  clearTarget: () => void
}

export const useFunctionNavigationStore = create<FunctionNavigationState>(
  (set) => ({
    target: undefined,
    navigateToFunction: (contractAddress, functionName) =>
      set({ target: { contractAddress, functionName } }),
    clearTarget: () => set({ target: undefined }),
  }),
)
