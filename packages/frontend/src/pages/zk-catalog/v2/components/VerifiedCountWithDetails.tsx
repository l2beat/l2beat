import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CircleQuestionMarkIcon } from '~/icons/CircleQuestionMark'
import { UnverifiedIcon } from '~/icons/Unverified'
import { VerifiedIcon } from '~/icons/Verified'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
import { cn } from '~/utils/cn'

interface Props {
  data: ZkCatalogEntry['trustedSetupsByProofSystem'][string]['verifiers']
  horizontal?: boolean
}

export function VerifiedCountWithDetails({ data, horizontal }: Props) {
  const totalCount =
    (data.successful?.count ?? 0) +
    (data.unsuccessful?.count ?? 0) +
    (data.notVerified?.count ?? 0)

  if (totalCount === 0) {
    return <NotApplicableBadge />
  }

  const elements = [
    {
      count: data.successful?.count,
      attesters: data.successful?.attesters,
      type: 'successful' as const,
    },
    {
      count: data.notVerified?.count,
      attesters: data.notVerified?.attesters,
      type: 'notVerified' as const,
    },
    {
      count: data.unsuccessful?.count,
      attesters: data.unsuccessful?.attesters,
      type: 'unsuccessful' as const,
    },
  ].filter((config) => config.count && config.count > 0)

  return (
    <div
      className={cn('flex flex-col gap-1.5', horizontal && 'flex-row gap-0')}
    >
      {elements.map((config, index) => (
        <div key={config.type} className="flex items-center">
          <CountWithAttesters
            count={config.count ?? 0}
            attesters={config.attesters}
            type={config.type}
          />
          {horizontal && index < elements.length - 1 && (
            <span className="mx-2 text-secondary">•</span>
          )}
        </div>
      ))}
    </div>
  )
}

export function CountWithAttesters({
  count,
  attesters,
  type,
  hideCount,
}: {
  count: number | undefined
  attesters:
    | (ZkCatalogAttester & {
        icon: string
      })[]
    | undefined
  type: 'successful' | 'notVerified' | 'unsuccessful'
  hideCount?: boolean
}) {
  if (count === 0) return null

  const Icon = typeToIcon(type)

  return (
    <div className="flex items-center gap-1">
      {!hideCount && (
        <span className="font-bold text-label-value-16 text-secondary leading-none">
          {count}
        </span>
      )}
      <Tooltip>
        <TooltipTrigger>
          <Icon className="size-4" />
        </TooltipTrigger>
        <TooltipContent>{`${typeToLabel(type)} verified`}</TooltipContent>
      </Tooltip>
      {attesters && attesters.length > 0 && (
        <span className="font-medium text-label-value-14 text-secondary leading-none">
          by
        </span>
      )}
      {attesters?.map((attester) => (
        <Tooltip key={attester.id}>
          <TooltipTrigger>
            <a href={attester.link} target="_blank" rel="noreferrer">
              <img
                src={attester.icon}
                alt={attester.name}
                className="size-4 min-w-4"
                width={16}
                height={16}
              />
            </a>
          </TooltipTrigger>
          <TooltipContent>{attester.name}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

function typeToIcon(type: 'successful' | 'notVerified' | 'unsuccessful') {
  switch (type) {
    case 'successful':
      return VerifiedIcon
    case 'notVerified':
      return CircleQuestionMarkIcon
    case 'unsuccessful':
      return UnverifiedIcon
  }
}

function typeToLabel(type: 'successful' | 'notVerified' | 'unsuccessful') {
  switch (type) {
    case 'successful':
      return 'Successfully'
    case 'notVerified':
      return 'Not'
    case 'unsuccessful':
      return 'Unsuccessfully'
  }
}
