import { LiveIndicator } from '~/components/LiveIndicator'

export function OngoingAnomalyBanner() {
  return (
    <div className="mb-1 flex items-center justify-center gap-2 rounded bg-red-500/10 py-1 text-red-500">
      <LiveIndicator />
      <span className="font-medium">Ongoing anomaly</span>
    </div>
  )
}
