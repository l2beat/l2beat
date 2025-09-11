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

interface Props {
  data: ZkCatalogEntry['trustedSetupsByProofSystem'][string]['verifiers']
}

export function VerifiedCountWithDetails({ data }: Props) {
  const totalCount =
    (data.successful?.count ?? 0) +
    (data.unsuccessful?.count ?? 0) +
    (data.notVerified?.count ?? 0)

  if (totalCount === 0) {
    return <NotApplicableBadge />
  }

  return (
    <div className="flex flex-col gap-1.5">
      <CountWithAttesters
        count={data.successful?.count}
        attesters={data.successful?.attesters}
        type="successful"
      />
      <CountWithAttesters
        count={data.notVerified?.count}
        attesters={data.notVerified?.attesters}
        type="notVerified"
      />
      <CountWithAttesters
        count={data.unsuccessful?.count}
        attesters={data.unsuccessful?.attesters}
        type="unsuccessful"
      />
    </div>
  )
}

function CountWithAttesters({
  count,
  attesters,
  type,
}: {
  count: number | undefined
  attesters:
    | (ZkCatalogAttester & {
        icon: string
      })[]
    | undefined
  type: 'successful' | 'notVerified' | 'unsuccessful'
}) {
  if (!count || count === 0) return null

  const Icon = typeToIcon(type)

  return (
    <div className="flex items-center gap-1">
      <span className="font-bold text-label-value-16 text-secondary leading-none">
        {count}
      </span>
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
