import { useEffect, useState } from 'react'
import { useStore } from '../store/store'

/**
 * A simple performance debug overlay that can be dropped into any branch to
 * quickly inspect rendering performance.  ✅
 *
 * It displays:
 *   • FPS – calculated using requestAnimationFrame
 *   • Total NodeView renders since page load
 *   • Visible nodes, hidden nodes & selected nodes counts
 *   • Current canvas scale level
 *
 * The overlay is rendered with `pointer-events: none` so it will never
 * interfere with normal interactions.
 */
export function PerformanceDebug() {
  // Frames-per-second
  const [fps, setFps] = useState(0)
  useEffect(() => {
    let frames = 0
    let prevTime = performance.now()
    let rafId: number

    const loop = () => {
      frames++
      const now = performance.now()
      if (now >= prevTime + 1000) {
        setFps(Math.round((frames * 1000) / (now - prevTime)))
        frames = 0
        prevTime = now
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Misc state of interest from the zustand store
  const totalNodes = useStore((s) => s.nodes.length)
  const hidden = useStore((s) => s.hidden.length)
  const selected = useStore((s) => s.selected.length)
  const scale = useStore((s) => s.transform.scale)

  return (
    <div
      className="fixed top-2 right-2 z-50 rounded bg-autumn-300/90 p-2 font-mono text-black text-xs shadow"
      style={{ pointerEvents: 'none' }}
    >
      <div>FPS: {fps}</div>
      <div>Total nodes: {totalNodes}</div>
      <div>Hidden: {hidden}</div>
      <div>Selected: {selected}</div>
      <div>Scale: {scale.toFixed(2)}</div>
    </div>
  )
}
