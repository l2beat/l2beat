import { useStore } from '../store/store'

export function MouseSelection() {
  const selection = useStore((state) => state.selection)

  if (!selection) {
    return null
  }

  return (
    <div
      className="absolute border border-autumn-300 bg-autumn-300 bg-opacity-20"
      style={{
        left: selection.x,
        top: selection.y,
        width: selection.width,
        height: selection.height,
      }}
    />
  )
}
