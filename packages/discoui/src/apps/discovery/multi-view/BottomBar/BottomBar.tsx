import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { IS_READONLY } from '../../../../config/readonly'
import { useIsomorphicKeys } from '../../hooks/useIsomorphicKeys'
import { useStore } from '../../panel-nodes/store/store'
import { useDiscoveryCommand } from '../../panel-terminal/useDiscoveryCommand'
import { useSearchStore } from '../../search/store'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import { addPanel, useDockingStore } from '../store'
import { Keys } from './Keys'
import { StatusRibbon } from './StatusRibbon'

export function BottomBar() {
  const { project } = useParams()
  const [hintOpen, setHintOpen] = useState(false)
  const loadLayout = useDockingStore((state) => state.loadLayout)
  const removeLeaf = useDockingStore((state) => state.removeLeaf)
  const toggleFullScreen = useDockingStore((state) => state.toggleFullScreen)
  const { discover, killCommand } = useDiscoveryCommand()
  const { altKey } = useIsomorphicKeys()
  const setOpen = useSearchStore((state) => state.setOpen)
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  const groupSelected = useStore((s) => s.groupSelected)
  const ungroupSelected = useStore((s) => s.ungroupSelected)

  const depthSpecified = maxReachableDepth !== null

  // By default when using bottom bar
  const useDevMode = true

  useEffect(() => {
    async function onKeyUp(e: KeyboardEvent) {
      if (e.code === 'F1') {
        setHintOpen((open) => !open)
      }
      for (let i = 0; i < 6; i++) {
        if (e.code === `Digit${i + 1}` && e.altKey) {
          loadLayout(i)
        }
      }
      if (e.code === 'Enter' && e.altKey) {
        addPanel()
      }
      if (e.code === 'KeyQ' && e.altKey) {
        removeLeaf()
      }
      if (e.code === 'KeyF' && e.altKey) {
        toggleFullScreen()
      }
      if ((e.code === 'KeyP' && e.altKey) || e.key === '/') {
        setOpen(true)
      }
      if (e.code === 'KeyR' && e.altKey) {
        if (project === undefined) {
          return
        }

        await discover(project, useDevMode)
      }
      if (e.code === 'KeyK' && e.altKey) {
        killCommand()
      }
      if (e.code === 'KeyG' && e.altKey) {
        if (e.shiftKey) {
          ungroupSelected()
        } else {
          groupSelected()
        }
      }
    }

    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <div className="hidden h-7 select-none items-center justify-between border-coffee-700 border-t bg-coffee-800 px-2 text-xs md:flex">
      <div className="flex gap-2 text-coffee-400">
        <div>Copyright {new Date().getUTCFullYear()} L2BEAT</div>
        {IS_READONLY && (
          <>
            <span>-</span>
            <div className="italic">
              That's the latest state reviewed by L2BEAT.
            </div>
          </>
        )}
      </div>
      <div className="flex h-full items-center gap-3">
        {depthSpecified && (
          <div className="flex items-center justify-center rounded-sm border border-aux-green/60 px-1.5 text-aux-green">
            Depth: {maxReachableDepth}
          </div>
        )}
        <StatusRibbon />
        <button
          className="flex h-full items-center gap-1.5 border-coffee-600 border-l pl-3 text-coffee-300 hover:text-coffee-100"
          onClick={() => setHintOpen((open) => !open)}
        >
          Help <Keys keys={['F1']} />
        </button>
        {hintOpen && (
          <div className="fixed right-2 bottom-9 rounded-md border border-coffee-600 bg-coffee-800 p-4 text-sm shadow-lg">
            <p>Keyboard Shortcuts</p>
            <ul>
              <li>
                <Keys keys={['F1']} /> - help
              </li>
              <li>
                <Keys keys={[altKey, '1']} /> to <Keys keys={['6']} /> - Select
                layout
              </li>
              <li>
                <Keys keys={[altKey, 'F']} /> - Fullscreen panel
              </li>
              <li>
                <Keys keys={[altKey, 'P']} /> or <Keys keys={['/']} /> - Toggle
                search
              </li>
              <li>
                <Keys keys={[altKey, 'Q']} /> - Remove panel
              </li>
              <li>
                <Keys keys={[altKey, 'Enter']} /> - Add panel
              </li>
              <hr className="my-1" />
              <li>
                <Keys keys={[altKey, 'G']} /> - Group nodes
              </li>
              <li>
                <Keys keys={[altKey, 'Shift', 'G']} /> - Ungroup nodes
              </li>
              <li>
                <Keys keys={['V']} /> - Selection tool
              </li>
              <li>
                <Keys keys={['H']} /> - Hand tool (drag to pan)
              </li>
              <li>
                <Keys keys={['Space']} /> + drag or middle mouse drag - Pan view
              </li>
              <hr className="my-1" />
              <li>
                <Keys keys={[altKey, 'R']} /> - Rediscover
              </li>
              <li>
                <Keys keys={[altKey, 'K']} /> - Kill command
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
