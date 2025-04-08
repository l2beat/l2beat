import type { DaLayersUsed } from '~/server/features/ecosystems/get-da-layers-used'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemDaLayersUsed({
  daLayersUsed,
  className,
}: {
  daLayersUsed: DaLayersUsed
  className?: string
}) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>DA Layers used</EcosystemWidgetTitle>
      <div>
        {Object.entries(daLayersUsed).map(([name, count]) => (
          <div key={name} className="flex justify-between">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs font-medium text-secondary">
              {count} projects
            </div>
          </div>
        ))}
      </div>
    </EcosystemWidget>
  )
}
