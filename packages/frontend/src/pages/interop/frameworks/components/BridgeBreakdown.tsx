import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { FrameworkOverview } from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { formatCurrency, formatNumber } from '../utils/format'

const BRIDGE_TYPE_COLORS: Record<string, string> = {
  burnAndMint: '#a78bfa',
  lockAndMint: '#f97316',
  nonMinting: '#fbbf24',
}

interface Props {
  frameworks: FrameworkOverview[]
}

export function BridgeBreakdown({ frameworks }: Props) {
  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Bridge Mechanism Breakdown
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          7-Day
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1600px]:grid-cols-4">
        {frameworks.map((fw) => {
          const totalVolume = fw.bridgeTypes.reduce((s, b) => s + b.volume, 0)
          return (
            <PrimaryCard key={fw.id}>
              <div className="mb-3 flex items-center gap-2">
                <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                <span className="font-bold text-heading-16">
                  {fw.shortName}
                </span>
              </div>
              {fw.bridgeTypes.length > 0 ? (
                <>
                  <div className="mb-3 flex h-2 overflow-hidden rounded-full">
                    {fw.bridgeTypes.map((b) => (
                      <div
                        key={b.type}
                        style={{
                          width: `${((b.volume / totalVolume) * 100).toFixed(1)}%`,
                          backgroundColor: BRIDGE_TYPE_COLORS[b.type] ?? '#888',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col">
                    {fw.bridgeTypes.map((b) => (
                      <div
                        key={b.type}
                        className="flex items-center justify-between border-b border-b-divider py-2 text-label-value-14 last:border-b-0"
                      >
                        <span className="flex items-center gap-1.5 text-secondary">
                          <span
                            className="inline-block size-2 rounded-full"
                            style={{
                              backgroundColor:
                                BRIDGE_TYPE_COLORS[b.type] ?? '#888',
                            }}
                          />
                          {formatBridgeType(b.type)}
                        </span>
                        <span className="font-medium tabular-nums">
                          {formatNumber(b.count)} ({formatCurrency(b.volume)})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <span className="py-2 text-label-value-12 text-secondary">
                  No data
                </span>
              )}
            </PrimaryCard>
          )
        })}
      </div>
    </div>
  )
}

const BRIDGE_TYPE_LABELS: Record<string, string> = {
  burnAndMint: 'Burn & Mint',
  lockAndMint: 'Lock & Mint',
  nonMinting: 'Non-Minting',
}

function formatBridgeType(type: string) {
  return BRIDGE_TYPE_LABELS[type] ?? type
}
