'use client'

import { Card } from '~/components/core/card'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { formatNumberWithCommas } from '~/utils/format-number'
import { useReport } from './report-context'

interface DetailsHeaderProps {
  vanityAddress: string
}

export function DetailsHeader(props: DetailsHeaderProps) {
  const report = useReport()

  return (
    <Card className="flex flex-col gap-4 rounded-none sm:rounded-xl">
      <h1 className="font-oswald text-3xl font-bold">Wallet insights</h1>
      <p className="text-sm  text-white/80">
        {`There were ${report.tokens.length} assets found.`}
      </p>
      <p className="text-sm  text-white/80">
        You can check the the details about a specific asset by expanding the
        rows.
      </p>
      <HorizontalSeparator className="!border-[#5656C759]" />
      <div className="font-oswald grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-2">
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-[#74749F]">Value</span>
          <span className="text-2xl font-bold leading-none text-[#D1FF1A]">
            ${formatNumberWithCommas(report.usdValue)}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-[#74749F]">Address</span>
          <span className="text-2xl font-semibold leading-none">
            {props.vanityAddress ?? report.address}
          </span>
        </div>
      </div>
    </Card>
  )
}
