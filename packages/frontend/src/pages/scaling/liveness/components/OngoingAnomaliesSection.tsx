import { LiveIndicator } from '~/components/LiveIndicator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'

interface Props {
  anomalies: (LivenessAnomaly & {
    project: { name: string; slug: string }
  })[]
}

export function OngoingAnomaliesSection({ anomalies }: Props) {
  return (
    <PrimaryCard>
      <div className="flex items-center gap-2">
        <LiveIndicator size="md" />
        <h2 className="font-bold text-lg text-negative">Ongoing anomalies</h2>
      </div>
      {anomalies.length > 0 && (
        <div className="flex items-center justify-center gap-1 text-negative">
          <LiveIndicator />
          {anomalies.map((anomaly) => {
            return (
              <span key={anomaly.project.slug}>{anomaly.project.name}</span>
            )
          })}
        </div>
      )}
    </PrimaryCard>
  )
}
