import { useStore } from '../store/store'

export function MouseSelection() {
  const selection = useStore((state) => state.selection)

  if (!selection) {
    return null
  }

  return (
    <div
      className="absolute border border-blue-600 bg-blue-100 bg-opacity-30"
      style={{
        left: selection.x,
        top: selection.y,
        width: selection.width,
        height: selection.height,
      }}
    />
  )
}
