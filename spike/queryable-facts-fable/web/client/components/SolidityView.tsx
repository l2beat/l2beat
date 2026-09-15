import { useEffect, useRef } from 'react'
import { tokenizeSolidity } from '../solidity'

/** Solidity source with a line gutter, syntax colours and a highlighted line range. */
export function SolidityView({
  text,
  highlight,
}: {
  text: string
  /** Inclusive 1-based line range to highlight and scroll to. */
  highlight?: [number, number]
}) {
  const lines = tokenizeSolidity(text.replace(/\n$/, ''))
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!highlight || !ref.current) return
    const el = ref.current.querySelector(`[data-line="${highlight[0]}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [highlight])
  return (
    <div className="source sol" ref={ref}>
      {lines.map((tokens, i) => {
        const n = i + 1
        const hl = highlight && n >= highlight[0] && n <= highlight[1]
        return (
          <div key={n} className={`ln ${hl ? 'hl' : ''}`} data-line={n}>
            <span className="gutter">{n}</span>
            <span>
              {tokens.map((t, j) =>
                t.cls === 'plain' ? (
                  t.text
                ) : (
                  <span key={`${n}-${j}`} className={t.cls}>
                    {t.text}
                  </span>
                ),
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}
