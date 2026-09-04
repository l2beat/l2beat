import { tokenizeDatalog } from '../lib/datalog'

export function DatalogView({
  text,
  firstLine = 1,
  highlight,
  onRelationClick,
  gutter = true,
}: {
  text: string
  firstLine?: number
  /** inclusive line range to highlight (absolute numbers) */
  highlight?: [number, number]
  onRelationClick?: (name: string) => void
  gutter?: boolean
}) {
  const lines = text.replace(/\n$/, '').split('\n')
  return (
    <div className="dl">
      {lines.map((line, i) => {
        const n = firstLine + i
        const hl = highlight && n >= highlight[0] && n <= highlight[1]
        return (
          <div className={`ln ${hl ? 'hl' : ''}`} key={n}>
            {gutter && <span className="gutter">{n}</span>}
            <span>
              {tokenizeDatalog(line).map((t, j) =>
                t.cls === 'rel' && onRelationClick ? (
                  <span
                    key={j}
                    className="rel link"
                    onClick={() => onRelationClick(t.text)}
                  >
                    {t.text}
                  </span>
                ) : (
                  <span key={j} className={t.cls}>
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
