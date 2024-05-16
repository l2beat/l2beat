import { isAddress } from 'viem'
import { formatAddress } from '~/utils/formatAddress'
import { formatNumberWithCommas } from '~/utils/formatNumber'

interface DetailsHeaderProps {
  dolarValue: number
  walletAddress: string
}

export function DetailsHeader(props: DetailsHeaderProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl flex flex-col gap-4 p-6">
      <h1 className="font-bold text-3xl">Assets&apos; Risks</h1>
      <div className="grid grid-cols-4">
        <div className="flex flex-col gap-[5px] col-span-2">
          <span className="text-zinc-500 font-bold text-xs">Value</span>
          <span className=" text-pink-900 font-extrabold text-xl">
            ${formatNumberWithCommas(props.dolarValue)}
          </span>
        </div>
        <div className="flex flex-col gap-[5px] col-span-2">
          <span className="text-zinc-500 font-bold text-xs">Wallet</span>
          <span className="font-semibold text-xl">
            {isAddress(props.walletAddress)
              ? formatAddress(props.walletAddress)
              : props.walletAddress}
          </span>
        </div>
      </div>
    </div>
  )
}
