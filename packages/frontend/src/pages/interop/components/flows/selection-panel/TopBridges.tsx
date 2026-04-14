import type { FlowProtocol } from '~/server/features/scaling/interop/getInteropFlows'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function TopBridges({ protocols }: { protocols: FlowProtocol[] }) {
  if (protocols.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12">TOP BRIDGES</div>
      <div className="space-y-1">
        {protocols.map((protocol) => (
          <div
            key={protocol.id}
            className="flex items-center justify-between gap-2 text-[13px]"
          >
            <span className="flex items-center gap-1 font-medium text-secondary leading-none">
              <img
                src={protocol.iconUrl}
                alt={protocol.name}
                className="size-4"
              />
              <span>{protocol.name}</span>
            </span>
            <span className="font-semibold leading-[1.15]">
              {formatCurrency(protocol.volume, 'usd')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
