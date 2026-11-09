import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { formatFee, formatTimes } from './metrics'
import mock from './pageMock.json'
import type { GasFeesChain } from './types'

const ACTIONS = {
  transfer: {
    label: 'ETH transfer',
    title: 'Cost of an ETH transfer',
    gas: '21,000 gas',
  },
  erc20: {
    label: 'ERC-20 transfer',
    title: 'Cost of an ERC-20 transfer',
    gas: '46,109 gas',
  },
  swap: {
    label: 'Token swap',
    title: 'Cost of a token swap',
    gas: '123,119 gas',
  },
} as const
type Action = keyof typeof ACTIONS

export function GasFeesCosts({ chains }: { chains: GasFeesChain[] }) {
  const [action, setAction] = useState<Action>('erc20')
  const ethereum = mock.costs.find((c) => c.id === 'ethereum')
  if (!ethereum) return null
  const rows = [
    ethereum,
    ...mock.costs
      .filter((c) => c.id !== 'ethereum')
      .sort((a, b) => a[action] - b[action]),
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl md:text-2xl">
            {ACTIONS[action].title}
          </h2>
          <p className="text-secondary text-xs">
            {ACTIONS[action].gas} at the day's median gas price, {mock.asOf}.
            L2s include their L1 fee.
          </p>
        </div>
        <RadioGroup
          name="gasFeesAction"
          value={action}
          onValueChange={(value) => setAction(value as Action)}
        >
          {(Object.keys(ACTIONS) as Action[]).map((key) => (
            <RadioGroupItem key={key} value={key}>
              {ACTIONS[key].label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm tabular-nums">
          <thead>
            <tr className="border-divider border-b text-secondary text-xs">
              <th className="py-2 text-left font-normal">Chain</th>
              <th className="py-2 text-right font-normal">Cost</th>
              <th className="w-1/2 py-2 pl-4 text-left font-normal max-md:hidden">
                Compared with Ethereum
              </th>
              <th className="py-2 text-right font-normal">Cheaper by</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const chain = chains.find((c) => c.id === row.id)
              const width = (row[action] / ethereum[action]) * 100
              return (
                <tr key={row.id} className="border-divider border-b">
                  <td className="py-2">
                    <span className="flex items-center gap-2.5">
                      {chain && (
                        <img
                          src={chain.iconUrl}
                          alt=""
                          width={22}
                          height={22}
                          className="size-[22px] rounded-full"
                        />
                      )}
                      <span className="flex flex-col leading-tight">
                        <span className="font-bold">
                          {chain?.shortName ?? chain?.name ?? row.id}
                        </span>
                        <span className="text-2xs text-secondary">
                          {chain?.type}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold">
                    {formatFee(row[action])}
                  </td>
                  <td className="py-2 pl-4 max-md:hidden">
                    <span
                      className="block h-3 rounded-r-md"
                      style={{
                        width: `max(3px, ${Math.min(100, width)}%)`,
                        backgroundColor: chain?.color,
                      }}
                    />
                  </td>
                  <td className="py-2 text-right">
                    {row.id === 'ethereum' ? (
                      <span className="text-secondary">baseline</span>
                    ) : (
                      <span className="font-medium">
                        {formatTimes(ethereum[action] / row[action])}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
