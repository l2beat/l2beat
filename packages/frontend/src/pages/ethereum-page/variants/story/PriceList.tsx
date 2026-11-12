import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { ValueSlot } from './Article'
import { ACTIONS, BLOB_GAS, gweiToEth } from './facts'
import { formatEth, formatInteger, formatUsd } from './format'

export interface Prices {
  /** Base fee plus the median tip, in gwei per gas */
  gasPriceGwei: number
  blobBaseFeeWei: number
  ethPriceUsd: number
}

/**
 * What things cost at this block, set like a menu: execution and blob space
 * side by side, ETH first and dollars after, since the fee is paid in ETH.
 */
export function PriceList({ prices }: { prices: Prices | undefined }) {
  const rows = [
    ...ACTIONS.map((a) => ({
      id: a.id,
      name: a.name,
      gas: `${formatInteger(a.gas)} gas`,
      eth: prices && gweiToEth(prices.gasPriceGwei * a.gas),
    })),
    {
      id: 'blob',
      name: 'Post a blob (128 KiB)',
      gas: `${formatInteger(BLOB_GAS)} blob gas`,
      eth: prices && (prices.blobBaseFeeWei * BLOB_GAS) / 1e18,
    },
  ]
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-primary border-b text-[12px] text-secondary">
          <th className="pb-2 font-medium">Right now</th>
          <th className="pb-2 font-medium max-sm:hidden">Uses</th>
          <th className="pb-2 text-right font-medium">Costs</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-divider border-b last:border-none">
            <td className="py-3 pr-3 font-medium text-[15px] md:text-[16px]">
              {row.name}
              {row.id === 'blob' && (
                <span className="block font-normal text-[12px] text-secondary">
                  Priced in its own market
                </span>
              )}
            </td>
            <td className="py-3 pr-3 text-[13px] text-secondary tabular-nums max-sm:hidden">
              {row.gas}
            </td>
            <td className="py-3 text-right tabular-nums">
              {row.eth !== undefined && prices ? (
                <>
                  <RollingNumber
                    value={row.eth}
                    format={formatEth}
                    className="font-semibold text-[15px] md:text-[16px]"
                  />
                  <span className="block text-[12px] text-secondary">
                    {formatUsd(row.eth * prices.ethPriceUsd)}
                  </span>
                </>
              ) : (
                <ValueSlot chars={8} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
