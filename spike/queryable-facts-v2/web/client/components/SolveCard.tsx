import { useState } from 'react'
import type { SolveInfo } from '../../shared/types'

function short(text: string): string {
  return text.replace(/^[^:]*:/, '').replace(/^[^.]*\./, '')
}

function shortAddr(addr: string): string {
  const m =
    /^(?:[a-z0-9]+:)?0x([0-9a-fA-F]{4})[0-9a-fA-F]{32}([0-9a-fA-F]{4})$/.exec(
      addr,
    )
  return m ? `0x${m[1]}…${m[2]}` : addr
}

/**
 * The solver's account of one write: the completing paths that perform it, who can drive it (with the
 * inputs a witness used), who is excluded, what is left unknown, and the SMT-LIB scripts behind it.
 * The evidence behind a solved* fact in a proof tree.
 */
export function SolveCard({ info }: { info: SolveInfo }) {
  const [showScripts, setShowScripts] = useState(false)
  const r = info.result
  return (
    <div className="solve-card">
      <div className="solve-head">
        <b>
          write of {short(r.variable) || short(r.effect)} on {shortAddr(r.addr)}
        </b>
        <span className="muted small">
          by calling {short(r.entry)} at {shortAddr(r.via)} · {r.paths.length}{' '}
          completing path{r.paths.length === 1 ? '' : 's'} ·{' '}
          {r.explored
            ? 'every execution explored'
            : 'not every execution explored'}{' '}
          · {r.checks} Z3 checks
        </span>
      </div>
      <div className="solve-grid">
        <div className="solve-k">can</div>
        <div>
          {r.admits.length === 0 && !r.open && (
            <span className="muted">nobody among the discovered addresses</span>
          )}
          {r.admits.map((a) => (
            <div key={a.actor} className="mono small">
              {a.actor} <span className="tag sound">{a.how}</span>
              {Object.keys(a.inputs).length > 0 && (
                <span className="muted">
                  {' '}
                  with{' '}
                  {Object.entries(a.inputs)
                    .map(([k, v]) => `${k}=${v}`)
                    .join(' ')}
                </span>
              )}
            </div>
          ))}
          {r.open && (
            <div className="small">
              <span className="tag sound">anyone</span> every address outside
              the discovered set passes (proven)
            </div>
          )}
        </div>
        <div className="solve-k">cannot</div>
        <div className="mono small">
          {r.excludes.length > 0
            ? r.excludes.join(', ')
            : r.explored
              ? 'none'
              : 'unknown: not every execution was explored'}
        </div>
        {r.residuals.length > 0 && (
          <>
            <div className="solve-k">unknown</div>
            <div>
              {r.residuals.map((x) => (
                <div key={`${x.kind}|${x.where}`} className="small">
                  <span className="tag heuristic">{x.kind}</span> {x.where}
                </div>
              ))}
            </div>
          </>
        )}
        {r.reads.length > 0 && (
          <>
            <div className="solve-k">reads</div>
            <div className="small muted">
              {r.reads
                .map((x) => {
                  const [a, v] = x.split('|')
                  return `${short(v ?? '')} at ${shortAddr(a ?? '')}`
                })
                .join(', ')}
            </div>
          </>
        )}
        <div className="solve-k">paths</div>
        <div>
          {r.paths.map((p, i) => (
            <details key={`p${i + 1}`} className="small">
              <summary className="mono">
                p{i + 1} · {p.split(' ; ').length} steps
              </summary>
              <ol className="solve-trace">
                {p.split(' ; ').map((step, k) => (
                  <li key={`${i}-${k}`}>{step.trim()}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>
      <div className="solve-foot muted small">
        evidence: {info.dir}/{' '}
        <button
          type="button"
          className="rule-toggle"
          onClick={() => setShowScripts(!showScripts)}
        >
          {showScripts ? 'hide the SMT-LIB' : 'show the SMT-LIB'}
        </button>
      </div>
      {showScripts && (
        <div className="solve-scripts">
          {info.scripts.a && (
            <>
              <div className="muted small">
                a.smt2 — who passes, and with which inputs
              </div>
              <pre className="source small">{info.scripts.a}</pre>
            </>
          )}
          {info.scripts.b && (
            <>
              <div className="muted small">
                b.smt2 — robustness: inputs that pass for every value of the
                unknowns
              </div>
              <pre className="source small">{info.scripts.b}</pre>
            </>
          )}
        </div>
      )}
    </div>
  )
}
