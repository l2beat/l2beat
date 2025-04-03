import type { EcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemDaLayersUsed({
  daLayersUsed,
}: {
  daLayersUsed: EcosystemEntry['daLayersUsed']
}) {
  return (
    <EcosystemWidget>
      <EcosystemWidgetTitle>DA Layers Used</EcosystemWidgetTitle>
      <div>
        {Object.entries(daLayersUsed).map(([name, count]) => (
          <div key={name} className="flex justify-between">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs font-medium text-secondary">{count}</div>
          </div>
        ))}
      </div>
    </EcosystemWidget>
  )
}
