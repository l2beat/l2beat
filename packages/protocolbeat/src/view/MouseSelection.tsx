import { useStore } from '../store/store'

export function MouseSelection() {
  const mouseSelection = useStore((state) => state.mouseSelection)

  if (!mouseSelection) {
    return null
  }

  return (
    <div
      className="absolute border border-blue-600 bg-blue-100 bg-opacity-30"
      style={{
        left: mouseSelection.x,
        top: mouseSelection.y,
        width: mouseSelection.width,
        height: mouseSelection.height,
      }}
    />
  )
}
