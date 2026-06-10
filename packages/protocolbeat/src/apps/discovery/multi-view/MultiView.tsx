import { useEffect } from 'react'
import { Docking, findLeafByKey } from '../../../components/docking'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { BottomBar } from './BottomBar/BottomBar'
import { useDockingStore } from './store'
import { TopBar } from './TopBar'

export interface MultiViewProps {
  project: string
}

export function MultiView(props: MultiViewProps) {
  const isMobileOrTablet = useIsMobile()
  const fullScreenLeaf = useDockingStore((state) => state.fullScreenLeaf)
  const activeLeaf = useDockingStore((state) => state.activeLeaf)
  const hasNodes = useDockingStore(
    (state) => findLeafByKey(state.tree, 'nodes') !== undefined,
  )
  const activateLeaf = useDockingStore((state) => state.activateLeaf)
  const toggleFullScreen = useDockingStore((state) => state.toggleFullScreen)

  useEffect(() => {
    if (!isMobileOrTablet || fullScreenLeaf !== undefined) return
    // Phones/tablets open a single pane; default to the graph when present.
    const preferred = hasNodes ? 'nodes' : activeLeaf
    if (!preferred) return
    activateLeaf(preferred)
    toggleFullScreen(preferred)
  }, [
    isMobileOrTablet,
    fullScreenLeaf,
    hasNodes,
    activeLeaf,
    activateLeaf,
    toggleFullScreen,
  ])

  return (
    <div className="flex h-full w-full flex-col">
      <TopBar project={props.project} />
      <div className="min-h-0 flex-1">
        <Docking useStore={useDockingStore} />
      </div>
      <BottomBar />
    </div>
  )
}
