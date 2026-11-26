import { useLayoutEffect, useRef, useState } from 'react'
import { chase } from './liveView'

type View = [number, number]

/**
 * What the charts show of a window moved through the buffer: on its way to
 * `target` each frame once another window is asked for, so they follow a
 * drag and ease to where a press or a key puts the window. There at once
 * when not animated
 */
export function useLiveChase({
  target,
  windowKey,
  animate,
  ahead,
}: {
  target: View | undefined
  /** The window asked for: another one is chased, the same one moving on is not */
  windowKey: string
  animate: boolean
  /** Seconds the target has moved on since it was drawn */
  ahead: () => number
}) {
  // where it set off from and when, so a render the pointer or keys bring
  // about draws where the view has got to as well, not only the next frame
  const [chasing, setChasing] = useState<{
    key: string
    from: View
    at: number
  }>()
  const [, setFrame] = useState(0)
  const shown = useRef<{ key: string; view: View }>(undefined)
  const goal = useRef({ target, ahead })
  goal.current = { target, ahead }

  const before = shown.current
  let next = chasing
  if (!animate || !target) next = undefined
  else if (before && before.key !== windowKey && chasing?.key !== windowKey) {
    next = { key: windowKey, from: before.view, at: performance.now() }
  }
  if (next !== chasing) setChasing(next)
  const moving = next !== undefined
  const view = (next && target && chaseFrom(next, target, ahead())) ?? target

  useLayoutEffect(() => {
    shown.current = view && { key: windowKey, view }
  })

  useLayoutEffect(() => {
    if (!moving) return
    let frame = 0
    const step = () => {
      const { target, ahead } = goal.current
      setChasing((current) =>
        current && target && chaseFrom(current, target, ahead())
          ? current
          : undefined,
      )
      setFrame((frame) => frame + 1)
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [moving])

  return { view, moving }
}

function chaseFrom(
  { from, at }: { from: View; at: number },
  target: View,
  ahead: number,
) {
  return chase(
    from,
    [target[0] + ahead, target[1] + ahead],
    performance.now() - at,
  )
}
