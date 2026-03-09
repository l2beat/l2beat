import { Badge } from '../../components/Badge'
import { UsdValue } from '../../components/UsdValue'
import { Expandable } from '../../components/Expandable'
import type { AggregatedDependency } from '../../types'
import { Link } from 'react-router-dom'

interface TopDependenciesProps {
  dependencies: AggregatedDependency[]
}

export function TopDependencies({ dependencies }: TopDependenciesProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-muted">
            <th className="text-left px-4 py-3 font-medium text-text-secondary">
              Dependency
            </th>
            <th className="text-left px-4 py-3 font-medium text-text-secondary">
              Entity
            </th>
            <th className="text-right px-4 py-3 font-medium text-text-secondary">
              TVL at Risk
            </th>
            <th className="text-right px-4 py-3 font-medium text-text-secondary">
              Protocols
            </th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((dep) => (
            <tr
              key={dep.address}
              className="border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-text-primary">
                {dep.name}
              </td>
              <td className="px-4 py-3">
                {dep.entity && <Badge variant="purple">{dep.entity}</Badge>}
              </td>
              <td className="px-4 py-3 text-right">
                <UsdValue value={dep.totalFundsAtRisk} variant="capital" />
              </td>
              <td className="px-4 py-3 text-right">
                <Expandable
                  trigger={
                    <span className="text-purple-600 font-medium">
                      {dep.protocols.length}
                    </span>
                  }
                >
                  <ul className="mt-1 space-y-1">
                    {dep.protocols.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to={`/protocol/${p.slug}`}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Expandable>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
