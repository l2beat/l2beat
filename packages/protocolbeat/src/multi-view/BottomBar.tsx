import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTerminalStore } from '../panel-terminal/store'
import { useSearchStore } from '../search/store'
import { useMultiViewStore } from './store'

function Keys(props: { keys: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {props.keys.map((key, i) => (
        <kbd
          key={i}
          className="rounded border-coffee-600 border-b-2 bg-coffee-200 px-1 text-coffee-800 leading-tight"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}

export function BottomBar() {
  const queryClient = useQueryClient()
  const { project } = useParams()
  const [hintOpen, setHintOpen] = useState(false)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  const removePanel = useMultiViewStore((state) => state.removePanel)
  const toggleFullScreen = useMultiViewStore((state) => state.toggleFullScreen)
  const discover = useTerminalStore((state) => state.discover)
  const setOpen = useSearchStore((state) => state.setOpen)

  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
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

        discover(project).then(() => {
          queryClient.invalidateQueries({ queryKey: ['projects', project] })
        })
      }
    }

    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const altKey = navigator.platform.includes('Mac') ? 'Opt' : 'Alt'

  return (
    <div className="hidden h-8 select-none items-center justify-between border-coffee-600 border-t px-2 text-sm md:flex">
      <div className="flex gap-2 text-xs">
        <div>Copyright {new Date().getUTCFullYear()} L2BEAT</div>
        <span>-</span>
        <div className="italic">
          That's the latest state reviewed by L2BEAT.
        </div>
      </div>
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
          </ul>
        </div>
      )}
    </div>
  )
}
