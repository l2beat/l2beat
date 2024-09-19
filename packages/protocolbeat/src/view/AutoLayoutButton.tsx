import { useStore } from '../store/store'
import { autoLayout } from './autoLayout'

export function AutoLayoutButton() {
  const nodes = useStore((state) => state.nodes)
  const updateNodeLocations = useStore((state) => state.updateNodeLocations)

  function handleAutoLayout() {
    updateNodeLocations(autoLayout(nodes))
  }

  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      type="button"
      onClick={handleAutoLayout}
    >
      Auto-layout
    </button>
  )
}
