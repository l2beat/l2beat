import type { ProjectUpgradeableActor, ReferenceLink } from '@l2beat/config'
import { Callout } from '~/components/Callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { linkVariants } from '~/components/link/CustomLink'
import { HighlightableLink } from '~/components/link/highlightable/HighlightableLink'
import { Markdown } from '~/components/markdown/Markdown'
import { BulletIcon } from '~/icons/Bullet'
import { ShieldIcon } from '~/icons/Shield'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'
import type { VerificationStatus } from '~/utils/project/contracts-and-permissions/toVerificationStatus'
import type { Participant } from './permissions/Participants'
import { ParticipantsEntry } from './permissions/Participants'
import { UpgradeConsiderations } from './permissions/UpgradeConsiderations'
import type { UsedInProject } from './permissions/UsedInProject'
import { UsedInProjectEntry } from './permissions/UsedInProject'
import { ReferenceList } from './ReferenceList'

export interface TechnologyContract {
  name: string
  addresses: TechnologyContractAddress[]
  admins: TechnologyContractAddress[]
  chain: string
  description?: string
  upgradeableBy?: ProjectUpgradeableActor[]
  upgradeDelay?: string
  usedInProjects?: UsedInProject[]
  participants?: Participant[]
  upgradeConsiderations?: string
  references: ReferenceLink[]
  impactfulChange: boolean
}

export interface TechnologyContractAddress {
  name: string
  href: string
  address: string
  verificationStatus: VerificationStatus
}

export interface ContractEntryProps {
  contract: TechnologyContract
  className?: string
}

export function ContractEntry({ contract, className }: ContractEntryProps) {
  const sharedProxies = contract.usedInProjects?.filter(
    (c) => c.type === 'proxy',
  )
  const sharedImplementations = contract.usedInProjects
    ?.filter((c) => c.type === 'implementation')
    .filter((c) => !sharedProxies?.map((k) => k.id).includes(c.id))
  const sharedPermissions = contract.usedInProjects?.filter(
    (c) => c.type === 'permission',
  )

  const { color, icon } = getCalloutProps(contract)

  const entries = [...contract.addresses, ...contract.admins]
  return (
    <Callout
      className={cn(color === undefined ? 'px-4' : 'p-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2 text-paragraph-15 md:text-paragraph-16">
            <strong
              id={contract.name}
              className="word-break-word scroll-mt-14 md:scroll-mt-10"
            >
              {contract.name}
            </strong>{' '}
            {entries.map((address, i) => (
              <HighlightableLink
                key={i}
                variant={
                  address.verificationStatus === 'unverified'
                    ? 'danger'
                    : undefined
                }
                href={address.href}
                address={address.address}
                className="flex items-center gap-0.5"
              >
                {address.verificationStatus === 'unverified' &&
                color !== 'red' ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <UnverifiedIcon className="fill-red-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                      This contract is not verified
                    </TooltipContent>
                  </Tooltip>
                ) : null}
                {address.name}
              </HighlightableLink>
            ))}
          </div>
          {contract.description && (
            <Markdown className="word-break-word mt-2 text-paragraph-15 md:text-paragraph-16">
              {contract.description}
            </Markdown>
          )}
          {contract.upgradeableBy && contract.upgradeableBy.length > 0 && (
            <div className="mt-2 flex flex-wrap text-paragraph-15 md:text-paragraph-16">
              <strong className="text-primary">Can be upgraded by:</strong>
              <div className="ml-1.5 flex flex-wrap gap-1.5">
                {contract.upgradeableBy.map((entry) => (
                  <a
                    key={entry.name}
                    className={linkVariants()}
                    href={`#${entry.name}`}
                  >
                    {`${entry.name} with ${entry.delay} delay`}
                  </a>
                ))}
              </div>
            </div>
          )}
          {contract.upgradeDelay && (
            <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
              <strong className="text-primary">Upgrade delay:</strong>{' '}
              {contract.upgradeDelay}
            </p>
          )}
          {contract.participants && (
            <ParticipantsEntry participants={contract.participants} />
          )}
          {sharedProxies && sharedProxies.length !== 0 && (
            <UsedInProjectEntry
              label="Proxy used in"
              implementations={sharedProxies}
            />
          )}
          {sharedImplementations && sharedImplementations.length !== 0 && (
            <UsedInProjectEntry
              label="Implementation used in"
              implementations={sharedImplementations}
            />
          )}
          {sharedPermissions && sharedPermissions.length !== 0 && (
            <UsedInProjectEntry
              label="Used in"
              implementations={sharedPermissions}
            />
          )}
          {contract.upgradeConsiderations && (
            <UpgradeConsiderations>
              {contract.upgradeConsiderations}
            </UpgradeConsiderations>
          )}
          {contract.references.length > 0 && (
            <ReferenceList references={contract.references} tight />
          )}
        </>
      }
    />
  )
}

function getCalloutProps(contract: TechnologyContract) {
  const isAnyAddressUnverified = contract.addresses.some(
    (c) => c.verificationStatus === 'unverified',
  )

  if (isAnyAddressUnverified) {
    return {
      color: 'red',
      icon: <UnverifiedIcon className="size-5 fill-red-300" />,
    } as const
  }

  const anyBecameVerified = contract.addresses.some(
    (c) => c.verificationStatus === 'became-verified',
  )

  if (anyBecameVerified) {
    return {
      color: 'yellow',
      icon: <UnderReviewIcon className="size-5" />,
    } as const
  }

  if (contract.impactfulChange) {
    return {
      color: undefined,
      icon: (
        <ShieldIcon className="size-5 fill-yellow-700 dark:fill-yellow-300" />
      ),
    }
  }

  return {
    color: undefined,
    icon: <BulletIcon className="size-5" />,
  }
}

export function technologyContractKey(contract: TechnologyContract) {
  return `${contract.name}-${contract.chain}-${contract.addresses
    .map((a) => a.address)
    .join('-')}`
}

export function ContractsWithImpactfulChanges(props: {
  contracts: TechnologyContract[]
  type: 'contracts' | 'permissions'
}) {
  return (
    <div className="rounded-lg border border-yellow-200 border-dashed px-4 py-3 text-paragraph-15 md:text-paragraph-16">
      <div className="flex w-full items-center rounded bg-yellow-700/20 p-4">
        There are impactful changes to the following {props.type}, and part of
        the information might be outdated.
      </div>
      {props.contracts.map((contract) => (
        <ContractEntry
          key={technologyContractKey(contract)}
          contract={contract}
          className="my-4 p-0"
        />
      ))}
    </div>
  )
}
