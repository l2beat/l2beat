import { useEffect, useState } from 'react'
import { useMultiViewStore } from './store'

function Keys(props: { keys: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {props.keys.map((key, i) => (
        <kbd key={i} className="bg-black px-1 text-white">
          {key}
        </kbd>
      ))}
    </span>
  )
}
export function BottomBar() {
  const [hintOpen, setHintOpen] = useState(false)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  const removePanel = useMultiViewStore((state) => state.removePanel)
  const toggleFullScren = useMultiViewStore((state) => state.toggleFullScren)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
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
        toggleFullScren()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const altKey = navigator.platform.includes('Mac') ? 'Opt' : 'Alt'

  return (
    <div className="flex h-8 items-center justify-between bg-blue-500 px-2 text-white">
      <div>Bottom Bar</div>
      <div className="flex gap-2">
        <button onClick={() => setHintOpen((open) => !open)}>
          Help <Keys keys={['F1']} />
        </button>
      </div>
      {hintOpen && (
        <div className="fixed right-2 bottom-8 bg-slate-100 p-4">
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
              <Keys keys={[altKey, 'Q']} /> - Remove panel
            </li>
            <li>
              <Keys keys={[altKey, 'Enter']} /> - Add panel
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
