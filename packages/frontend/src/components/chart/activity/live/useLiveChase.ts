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
  // where it set off from and when, so renders the pointer or keys bring
  // about, however often, draw where the view has got to
  const [chasing, setChasing] = useState<Chasing>()
  const [, setFrame] = useState(0)
  const shown = useRef<{ key: string; view: View }>(undefined)
  const goal = useRef({ target, ahead })
  goal.current = { target, ahead }

  const before = shown.current
  let next = chasing
  if (!animate || !target) next = undefined
  else if (before && before.key !== windowKey && chasing?.key !== windowKey) {
    const at = performance.now()
    const from = chasing
      ? (chaseFrom(chasing, chasing.target, ahead(), at) ?? chasing.target)
      : before.view
    next = { key: windowKey, from, target, at }
  }
  if (next !== chasing) setChasing(next)
  const moving = next !== undefined
  const view =
    (next && target && chaseFrom(next, target, ahead(), performance.now())) ??
    target

  useLayoutEffect(() => {
    shown.current = view && { key: windowKey, view }
  })

  useLayoutEffect(() => {
    if (!moving) return
    let frame = 0
    const step = () => {
      const { target, ahead } = goal.current
      setChasing((current) =>
        current &&
        target &&
        chaseFrom(current, target, ahead(), performance.now())
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

interface Chasing {
  key: string
  from: View
  /** The window chased, as it was when it set off */
  target: View
  at: number
}

function chaseFrom(
  { from, at }: Chasing,
  target: View,
  ahead: number,
  now: number,
) {
  return chase(from, [target[0] + ahead, target[1] + ahead], now - at)
}
