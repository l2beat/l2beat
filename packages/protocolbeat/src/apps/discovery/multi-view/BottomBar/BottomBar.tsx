import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IS_READONLY } from '../../../../config/readonly'
import { useIsomorphicKeys } from '../../hooks/useIsomorphicKeys'
import { useDiscoveryCommand } from '../../panel-terminal/useDiscoveryCommand'
import { useSearchStore } from '../../search/store'
import { useMultiViewStore } from '../store'
import { Keys } from './Keys'
import { StatusRibbon } from './StatusRibbon'

export function BottomBar() {
  const { project } = useParams()
  const [hintOpen, setHintOpen] = useState(false)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  const removePanel = useMultiViewStore((state) => state.removePanel)
  const toggleFullScreen = useMultiViewStore((state) => state.toggleFullScreen)
  const { discover, killCommand } = useDiscoveryCommand()
  const { altKey } = useIsomorphicKeys()
  const setOpen = useSearchStore((state) => state.setOpen)

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
        removePanel()
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
    }

    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <div className="hidden h-8 select-none items-center justify-between border-coffee-600 border-t px-2 text-sm md:flex">
      <div className="flex gap-2 text-xs">
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
      <div className="flex gap-4">
        <StatusRibbon />
        <div className="flex gap-2">
          <button onClick={() => setHintOpen((open) => !open)}>
            Help <Keys keys={['F1']} />
          </button>
        </div>
        {hintOpen && (
          <div className="fixed right-2 bottom-10 border border-coffee-600 bg-coffee-800 p-4">
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
