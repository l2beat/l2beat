import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropProtocolData } from '~/server/features/scaling/interop/utils/getTopProtocols'
import { api } from '~/trpc/React'
import { generateAccessibleColors } from '~/utils/generateColors'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { useInteropSelectedChains } from '../utils/InteropSelectedChainsContext'
import { TopProtocolsByVolumeChart } from './TopProtocolsByVolumeChart'

export type DisplayProtocol = InteropProtocolData & {
  color: string
  othersCount?: number
}

export function TopProtocolsByVolume() {
  const { selectedChains } = useInteropSelectedChains()
  const uniqChains = uniq([...selectedChains.from, ...selectedChains.to])
  const { data } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  const protocolsWithOthers = useMemo(() => {
    if (!data?.topProtocols) return []

    const top5 = data.topProtocols.slice(0, 5)
    const others = data.topProtocols.slice(5)

    if (others.length === 0) {
      return top5
    }

    const totalVolume = data.topProtocols.reduce((sum, p) => sum + p.volume, 0)
    const othersVolume = others.reduce((sum, p) => sum + p.volume, 0)
    const othersShare = (othersVolume / totalVolume) * 100

    return [
      ...top5,
      {
        protocolName: 'Others',
        volume: othersVolume,
        share: othersShare,
        othersCount: others.length,
      },
    ]
  }, [data?.topProtocols])

  const colors = useMemo(
    () => generateAccessibleColors(protocolsWithOthers.length),
    [protocolsWithOthers.length],
  )

  const protocolsWithColors: DisplayProtocol[] = protocolsWithOthers.map(
    (protocol, index) => ({
      ...protocol,
      color: colors[index] ?? '#000000',
    }),
  )

  return (
    <PrimaryCard className="flex items-start justify-between">
      <div>
        <h2 className="font-bold text-heading-20">Last 24 hours volume</h2>
        <div className="mt-0.5 font-medium text-label-value-14 text-secondary">
          Between {uniqChains.length} supported chains
        </div>
        <table className="mt-2 border-separate border-spacing-y-1">
          <tbody>
            {protocolsWithColors.map((protocol) => (
              <tr key={protocol.protocolName}>
                <td className="flex items-center gap-1 font-medium text-2xs">
                  <div
                    className="size-3 rounded-xs"
                    style={{ backgroundColor: protocol.color }}
                  />
                  {protocol.protocolName === 'Others'
                    ? `Others (${protocol.othersCount ?? 0})`
                    : protocol.protocolName}
                </td>
                <td className="px-2 font-medium text-2xs text-secondary">
                  {protocol.share.toFixed(2)}%
                </td>
                <td className="font-medium text-2xs">
                  {formatCurrency(protocol.volume, 'usd')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TopProtocolsByVolumeChart protocols={protocolsWithColors} />
    </PrimaryCard>
  )
}
