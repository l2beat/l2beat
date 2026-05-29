import { useEffect } from 'react'
import { Docking, findLeafByTab } from '../../../components/docking'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { BottomBar } from './BottomBar/BottomBar'
import { useDockingStore } from './store'
import { TopBar } from './TopBar'

export interface MultiViewProps {
  project: string
}

export function MultiView(props: MultiViewProps) {
  const isMobileOrTablet = useIsMobile()
  const fullScreenTab = useDockingStore((state) => state.fullScreenTab)
  const activeTab = useDockingStore((state) => state.activeTab)
  const hasNodes = useDockingStore(
    (state) => findLeafByTab(state.tree, 'nodes') !== undefined,
  )
  const activateTab = useDockingStore((state) => state.activateTab)
  const toggleFullScreen = useDockingStore((state) => state.toggleFullScreen)

  useEffect(() => {
    if (!isMobileOrTablet || fullScreenTab !== undefined) return
    // Phones/tablets open a single pane; default to the graph when present.
    const preferred = hasNodes ? 'nodes' : activeTab
    if (!preferred) return
    activateTab(preferred)
    toggleFullScreen(preferred)
  }, [
    isMobileOrTablet,
    fullScreenTab,
    hasNodes,
    activeTab,
    activateTab,
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
