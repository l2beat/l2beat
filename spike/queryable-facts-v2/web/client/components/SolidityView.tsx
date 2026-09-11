import { tokenizeSolidity } from '../lib/solidity'

/** Solidity source with a line gutter and syntax colours. */
export function SolidityView({
  text,
  gutter = true,
}: {
  text: string
  gutter?: boolean
}) {
  const lines = tokenizeSolidity(text.replace(/\n$/, ''))
  return (
    <pre className="source sol">
      {lines.map((tokens, i) => (
        <div key={i} className="ln">
          {gutter && <span className="gutter">{i + 1}</span>}
          <span>
            {tokens.map((t, j) =>
              t.cls === 'plain' ? (
                t.text
              ) : (
                <span key={j} className={t.cls}>
                  {t.text}
                </span>
              ),
            )}
          </span>
        </div>
      ))}
    </pre>
  )
}
