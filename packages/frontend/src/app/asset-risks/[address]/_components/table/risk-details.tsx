import Image from 'next/image'
import Link from 'next/link'
import { OutLinkIcon } from '~/icons/outlink'
import { cn } from '~/utils/cn'
import { formatAddress } from '~/utils/format-address'
import { CriticalBadgeIcon } from '../../_assets/critical-badge'
import { WarningBadgeIcon } from '../../_assets/warning-badge'
import { type Risk } from '../../page'
import { type Token } from './tokens-table'

export function RiskDetails({ token }: { token: Token }) {
  const bridges = token.token.bridgedUsing?.bridges
  return (
    <div className="flex flex-col gap-5 border-t border-t-gray-400 pb-4">
      <div className="grid grid-cols-4 pt-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-500">Token</span>
          <div className="flex items-center gap-1 font-medium">
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
              <span className="text-[13px] uppercase text-gray-500">
                {token.token.symbol}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-500">
            Block explorer
          </span>
          {token.token.address ? (
            // TODO: Add link to block explorer when we start fetching from DB
            <Link href={'/'} className="flex items-center gap-1">
              <span className="font-medium text-blue-600 underline">
                {formatAddress(token.token.address)}
              </span>
              <OutLinkIcon className="fill-blue-600" />
            </Link>
          ) : (
            <span>Not available</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-500">Chain</span>
          <div className="flex items-center gap-1 font-medium">
            {/* TODO: Add link to block explorer when we start fetching from DB */}
            <Link
              href={'/'}
              className="text-base font-medium text-blue-700 underline"
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
          <span className="text-xs font-bold text-zinc-500">Bridge</span>
          <div className="flex items-center gap-1 font-medium">
            {/* TODO: Add link to block explorer when we start fetching from DB */}
            <Link
              href={'/'}
              className="text-base font-medium text-blue-700 underline"
            >
              {/* TODO: add link to bridge icon */}
              {/* <Image
              src={token.token.iconUrl}
              alt={`${token.token.symbol} icon`}
              height={16}
              width={16}
              className="size-4"
            /> */}
              {bridges && bridges.length === 1
                ? bridges[0]?.name
                : bridges && bridges.length > 1
                  ? 'Multiple'
                  : 'Unknown'}
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
    <div className="flex flex-col gap-[8px] rounded-lg border border-gray-400 p-4">
      <span className="text-[13px] font-medium uppercase text-zinc-500">
        {title}
      </span>
      <div className="flex flex-col gap-3 pl-4">
        {risks.map((risk, i) => (
          <div key={i}>
            <div className="flex items-center gap-2">
              <div className="size-5">
                {risk.isCritical ? <CriticalBadgeIcon /> : <WarningBadgeIcon />}
              </div>
              <span
                className={cn(
                  'whitespace-normal text-sm font-medium',
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
