import { tokenizeDatalog } from '../datalog'

export function DatalogView({
  text,
  firstLine = 1,
  onRelationClick,
}: {
  text: string
  firstLine?: number
  onRelationClick?: (name: string) => void
}) {
  const lines = text.replace(/\n$/, '').split('\n')
  return (
    <div className="dl">
      {lines.map((line, i) => {
        const n = firstLine + i
        return (
          <div className="ln" key={n}>
            <span className="gutter">{n}</span>
            <span>
              {tokenizeDatalog(line).map((t, j) =>
                t.cls === 'rel' && onRelationClick ? (
                  <button
                    type="button"
                    key={`${n}-${j}`}
                    className="rel link"
                    onClick={() => onRelationClick(t.text)}
                  >
                    {t.text}
                  </button>
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
