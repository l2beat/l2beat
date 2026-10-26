import {
  createContext,
  type ReactNode,
  useContext,
  useDeferredValue,
} from 'react'
import { usePanelStore } from '../store/panel-store'

const DeferredSelectionContext = createContext<string[] | undefined>(undefined)

// The panels showing the selected contract are heavy to render, so they follow
// the selection in a background render, all at once. The list and the graph
// read the store directly and show the click in the very next frame. Deferring
// here, above them, lets the urgent render stop at this provider.
export function DeferredSelectionProvider(props: { children: ReactNode }) {
  const selected = usePanelStore((state) => state.selected)
  const deferred = useDeferredValue(selected)
  return (
    <DeferredSelectionContext.Provider value={deferred}>
      {props.children}
    </DeferredSelectionContext.Provider>
  )
}

export function useDeferredSelection(): string[] {
  const selected = useContext(DeferredSelectionContext)
  if (selected === undefined) {
    throw new Error('useDeferredSelection used outside its provider')
  }
  return selected
}
