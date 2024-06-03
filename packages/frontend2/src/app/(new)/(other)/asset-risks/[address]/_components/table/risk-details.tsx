import Image from 'next/image'
import Link from 'next/link'
import { formatAddress } from '~/app/utils/format-address'
import OutLinkIcon from '~/icons/outlink.svg'
import { cn } from '~/utils/cn'
import CriticalIcon from '../../_assets/critical-badge.svg'
import WarningIcon from '../../_assets/warning-badge.svg'
import { type Risk } from '../../page'
import { type Token } from './tokens-table'

export function RiskDetails({ token }: { token: Token }) {
  return (
    <div className="flex flex-col border-t gap-5 border-t-gray-400">
      <div className="grid grid-cols-4 pt-4">
        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs font-bold">Token</span>
          <div className="flex items-center gap-1 font-semibold">
            {token.token.iconUrl && (
              <Image
                src={token.token.iconUrl}
                alt={`${token.token.symbol} icon`}
                height={16}
                width={16}
                className="size-4"
              />
            )}
            <div className="text-base text-zinc-800">
              {token.token.name}&nbsp;
              <span className="uppercase text-[13px] text-gray-500">
                {token.token.symbol}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs font-bold">
            Block explorer
          </span>
          {token.token.address ? (
            // TODO: Add link to block explorer when we start fetching from DB
            <Link href={'/'} className="flex items-center gap-1">
              <span className="font-semibold text-blue-600 underline">
                {formatAddress(token.token.address)}
              </span>
              <OutLinkIcon className="fill-blue-600" />
            </Link>
          ) : (
            <span>Not available</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs font-bold">Chain</span>
          <div className="flex items-center gap-1 font-semibold">
            {/* TODO: Add link to block explorer when we start fetching from DB */}
            <Link
              href={'/'}
              className="text-base text-blue-700 font-semibold underline"
            >
              {/* TODO: add link to chain icon */}
              {/* <Image
              src={token.token.iconUrl}
              alt={`${token.token.symbol} icon`}
              height={16}
              width={16}
              className="size-4"
            /> */}
              {token.chain.name}
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs font-bold">Bridge</span>
          <div className="flex items-center gap-1 font-semibold">
            {/* TODO: Add link to block explorer when we start fetching from DB */}
            <Link
              href={'/'}
              className="text-base text-blue-700 font-semibold underline"
            >
              {/* TODO: add link to bridge icon */}
              {/* <Image
              src={token.token.iconUrl}
              alt={`${token.token.symbol} icon`}
              height={16}
              width={16}
              className="size-4"
            /> */}
              {token.token.bridge ?? 'Unknown'}
            </Link>
          </div>
        </div>
      </div>
      <CategoryRisks title="chain risks" risks={token.chain.risks} />
    </div>
  )
}

function CategoryRisks({ title, risks }: { title: string; risks: Risk[] }) {
  risks = risks.sort((a, b) =>
    a.isCritical === b.isCritical ? 0 : a.isCritical ? -1 : 1,
  )

  if (risks.length === 0) {
    return null
  }

  return (
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col gap-[8px]">
      <span className="text-[13px] text-zinc-500 font-semibold uppercase">
        {title}
      </span>
      <div className="flex flex-col gap-3 pl-4">
        {risks.map((risk, i) => (
          <div key={i}>
            <div className="flex gap-2 items-center">
              <div className="size-5">
                {risk.isCritical ? <CriticalIcon /> : <WarningIcon />}
              </div>
              <span
                className={cn(
                  'font-semibold text-sm whitespace-normal',
                  risk.isCritical ? 'text-red-700' : 'text-zinc-800',
                )}
              >
                {risk.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
