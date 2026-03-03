import type { CompiledReview } from '../../types'
import { buildSharedDependencies } from '../../utils/comparison'
import { Badge } from '../../components/Badge'

interface SharedDependencyMapProps {
  reviews: CompiledReview[]
}

export function SharedDependencyMap({ reviews }: SharedDependencyMapProps) {
  const sharedDeps = buildSharedDependencies(reviews)

  if (sharedDeps.length === 0) return null

  const maxProtocols = Math.max(...sharedDeps.map((d) => d.protocols.length))

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Cross-Protocol Dependency Map
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        External dependencies shared across multiple protocols
      </p>

      <div className="space-y-3">
        {sharedDeps.map((dep) => {
          const barWidth =
            maxProtocols > 0
              ? (dep.protocols.length / maxProtocols) * 100
              : 0
          const isShared = dep.protocols.length > 1

          return (
            <div
              key={dep.name}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-text-primary text-sm">
                  {dep.name}
                </span>
                {dep.entity && (
                  <Badge variant="purple">{dep.entity}</Badge>
                )}
                {isShared && (
                  <Badge className="bg-status-amber/10 text-status-amber">
                    Shared
                  </Badge>
                )}
              </div>

              {/* Bar showing protocol reach */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-6 bg-bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isShared ? 'bg-status-amber' : 'bg-purple-400'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary whitespace-nowrap min-w-[80px] text-right">
                  {dep.protocols.length} protocol
                  {dep.protocols.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Protocol names */}
              <div className="flex flex-wrap gap-1 mt-2">
                {dep.protocols.map((name) => (
                  <span
                    key={name}
                    className="text-xs px-2 py-0.5 rounded bg-bg-muted text-text-secondary"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
