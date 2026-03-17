import { Breakdown } from '~/components/breakdown/Breakdown'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { BetweenChainsInfo } from '../../components/BetweenChainsInfo'
import type { TransferTypeBreakdown } from '../getTransferTypeBreakdown'

interface Props {
  breakdown: TransferTypeBreakdown
}

const TRANSFER_TYPE_CONFIG = [
  {
    key: 'nonMinting',
    label: 'Non-minting',
    className: 'bg-blue-600',
  },
  {
    key: 'lockAndMint',
    label: 'Lock & Mint',
    className: 'bg-yellow-700',
  },
  {
    key: 'burnAndMint',
    label: 'Burn & Mint',
    className: 'bg-teal-500',
  },
] as const

export function BreakdownByTransferType({ breakdown }: Props) {
  return (
    <PrimaryCard className="flex flex-col border-transparent md:border-t-4">
      <div className="flex h-[34px] shrink-0 items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Breakdown by transfer type
        </h2>
      </div>
      <BetweenChainsInfo className="mt-1" />
      <div className="mt-4 flex flex-col gap-5">
        <BreakdownSection
          label="Volume"
          values={TRANSFER_TYPE_CONFIG.map((item) => ({
            ...item,
            value: breakdown.volume[item.key],
            formattedValue: formatCurrency(breakdown.volume[item.key], 'usd'),
          }))}
        />
        <BreakdownSection
          label="Transfer count"
          values={TRANSFER_TYPE_CONFIG.map((item) => ({
            ...item,
            value: breakdown.transferCount[item.key],
            formattedValue: formatInteger(breakdown.transferCount[item.key]),
          }))}
        />
      </div>
    </PrimaryCard>
  )
}

function BreakdownSection({
  label,
  values,
}: {
  label: string
  values: {
    label: string
    value: number
    formattedValue: string
    className: string
  }[]
}) {
  return (
    <div>
      <div className="font-bold text-label-value-12 text-secondary uppercase">
        {label}
      </div>

      <Breakdown className="mt-2! h-2 w-full" gap={0} values={values} />
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {values.map((value) => (
          <div key={value.label} className="flex items-center gap-2">
            <div className={`size-2 rounded-full ${value.className}`} />
            <span className="font-medium text-label-value-12 text-secondary">
              {value.label}
            </span>
            <span className="font-bold text-label-value-12">
              {value.formattedValue}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
