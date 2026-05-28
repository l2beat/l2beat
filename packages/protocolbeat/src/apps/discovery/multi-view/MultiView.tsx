import { useEffect } from 'react'
import { Docking } from '../../../components/docking'
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
  const toggleFullScreen = useDockingStore((state) => state.toggleFullScreen)

  useEffect(() => {
    if (!isMobileOrTablet || fullScreenTab !== undefined) return
    const preferred = activeTab ?? 'nodes'
    toggleFullScreen(preferred)
  }, [isMobileOrTablet, fullScreenTab, activeTab, toggleFullScreen])

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
