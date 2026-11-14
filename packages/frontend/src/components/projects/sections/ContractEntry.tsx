import type { ProjectUpgradeableActor, ReferenceLink } from '@l2beat/config'
import { Fragment } from 'react'
import { Badge } from '~/components/badge/Badge'
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
import { type PastUpgradesData, PastUpgradesDialog } from './PastUpgradesDialog'
import { GroupedActorAddresses } from './permissions/GroupedActorAddresses'
import type { Participant } from './permissions/Participants'
import { ParticipantsEntry } from './permissions/Participants'
import { splitUsedInProjects } from './permissions/splitUsedInProjects'
import { UpgradeConsiderations } from './permissions/UpgradeConsiderations'
import type { UsedInProject } from './permissions/UsedInProject'
import { UsedInProjectEntry } from './permissions/UsedInProject'
import { ReferenceList } from './ReferenceList'
import {
  ESCROW_ALL_TOKENS_INCLUDED,
  ESCROW_TOKENS_INCLUDED,
  impactfulChangesWarning,
} from './sectionCopy'

export interface TechnologyContract {
  id: string
  additionalAnchorIds?: string[]
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
  pastUpgrades?: PastUpgradesData
  escrow?: TechnologyContractEscrow
  groupCount?: number
}

export interface TechnologyContractAddress {
  name: string
  href: string
  address: string
  verificationStatus: VerificationStatus
  anchorId?: string
}

export interface TechnologyContractEscrow {
  tokens: string[] | '*'
  tokenIcons: TechnologyContractEscrowToken[]
  isCustom?: boolean
}

interface TechnologyContractEscrowToken {
  symbol: string
  iconUrl: string
}

interface ContractEntryProps {
  contract: TechnologyContract
  className?: string
  expandableAddresses?: boolean
}

export function ContractEntry({
  contract,
  className,
  expandableAddresses = false,
}: ContractEntryProps) {
  const {
    proxies: sharedProxies,
    implementations: sharedImplementations,
    permissions: sharedPermissions,
  } = splitUsedInProjects(contract.usedInProjects ?? [])

  const { color, icon } = getCalloutProps(contract)

  const entries = numberRepeatedNames([
    ...contract.addresses,
    ...contract.admins,
  ])
  return (
    <Callout
      className={cn(
        // An uncoloured entry has no box to pad: on phones its text starts at
        // the list's bullet, so deep permission trees keep a readable width.
        color === undefined ? 'max-md:gap-0 md:px-4' : 'p-4',
        className,
      )}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2 text-paragraph-15 md:text-paragraph-16">
            <strong
              id={contract.id}
              className="word-break-word relative scroll-mt-section-nav font-semibold"
            >
              {contract.additionalAnchorIds?.map((anchorId) => (
                <span
                  key={anchorId}
                  id={anchorId}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 size-px scroll-mt-section-nav"
                />
              ))}
              {contract.name}
            </strong>
            {contract.groupCount && contract.groupCount > 1 ? (
              <Badge type="gray" size="small">
                {contract.groupCount} instances
              </Badge>
            ) : null}
            {contract.escrow && (
              <EscrowBadge isCustom={contract.escrow.isCustom} />
            )}
            {expandableAddresses ? (
              <GroupedActorAddresses
                addresses={contract.addresses}
                className="basis-full"
              />
            ) : (
              entries.map((address, i) => (
                <HighlightableLink
                  key={i}
                  id={address.anchorId}
                  variant={
                    address.verificationStatus === 'unverified'
                      ? 'danger'
                      : undefined
                  }
                  href={address.href}
                  address={address.address}
                  className="flex scroll-mt-section-nav items-center gap-0.5"
                >
                  {address.verificationStatus === 'unverified' &&
                  color !== 'red' ? (
                    <Tooltip>
                      <TooltipTrigger aria-label="Unverified contract">
                        <UnverifiedIcon className="fill-red-300" aria-hidden />
                      </TooltipTrigger>
                      <TooltipContent>
                        This contract is not verified
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                  {address.name}
                </HighlightableLink>
              ))
            )}
          </div>
          {contract.pastUpgrades?.upgrades &&
            contract.pastUpgrades.upgrades.length > 0 && (
              <PastUpgradesDialog pastUpgrades={contract.pastUpgrades} />
            )}
          {contract.description && (
            <Markdown className="word-break-word mt-2 text-paragraph-15 md:text-paragraph-16 [&>ul>li+li]:mt-2">
              {contract.description}
            </Markdown>
          )}
          {contract.escrow && <EscrowDetailsEntry escrow={contract.escrow} />}
          {contract.upgradeableBy && contract.upgradeableBy.length > 0 && (
            // One flat run, so the first upgrader stays on the key's line and
            // the rest wrap after it; commas sit outside the links.
            <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
              <span className="font-medium">Can be upgraded by:</span>{' '}
              {contract.upgradeableBy.map((entry, i, all) => (
                <Fragment key={entry.name}>
                  {entry.unreachable ? (
                    <span>{`${entry.name} with ${entry.delay} delay`}</span>
                  ) : (
                    <a
                      className={linkVariants()}
                      href={`#${entry.id ?? entry.name}`}
                    >
                      {`${entry.name} with ${entry.delay} delay`}
                    </a>
                  )}
                  {i < all.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          )}
          {contract.upgradeDelay && (
            <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
              <span className="font-medium">Upgrade delay:</span>{' '}
              {contract.upgradeDelay}
            </p>
          )}
          {contract.participants && (
            <ParticipantsEntry participants={contract.participants} />
          )}
          {sharedProxies.length !== 0 && (
            <UsedInProjectEntry
              label="Proxy used in"
              implementations={sharedProxies}
            />
          )}
          {sharedImplementations.length !== 0 && (
            <UsedInProjectEntry
              label="Implementation used in"
              implementations={sharedImplementations}
            />
          )}
          {sharedPermissions.length !== 0 && (
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

function EscrowBadge({ isCustom }: { isCustom?: boolean }) {
  return (
    <Badge type="pink" size="small">
      {isCustom ? 'Custom escrow' : 'Escrow'}
    </Badge>
  )
}

function EscrowDetailsEntry({ escrow }: { escrow: TechnologyContractEscrow }) {
  if (escrow.tokens === '*') {
    return (
      <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
        <span className="font-medium">{ESCROW_ALL_TOKENS_INCLUDED}</span>
      </p>
    )
  }

  return (
    <div className="mt-2 flex flex-wrap items-center text-paragraph-15 md:text-paragraph-16">
      <span className="mr-1.5 font-medium">{ESCROW_TOKENS_INCLUDED}</span>
      {escrow.tokenIcons.length === 0 && (
        <span className="text-secondary">none tracked</span>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {escrow.tokenIcons.map((token) => (
          <Tooltip key={token.symbol}>
            <TooltipTrigger asChild>
              <span className="shrink-0">
                <img
                  src={token.iconUrl}
                  alt={`${token.symbol} token logo`}
                  title={token.symbol}
                  className="size-5 rounded-full"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>{token.symbol}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
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
      icon: <ShieldIcon className="size-5 fill-warning" />,
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
  expandableAddresses?: boolean
}) {
  return (
    <div className="rounded-lg border border-yellow-200 border-dashed px-4 py-3 text-paragraph-15 md:text-paragraph-16">
      <div className="flex w-full items-center rounded bg-yellow-700/20 p-4">
        {impactfulChangesWarning(props.type)}
      </div>
      {props.contracts.map((contract) => (
        <ContractEntry
          key={technologyContractKey(contract)}
          contract={contract}
          className="my-4 p-0"
          expandableAddresses={
            props.expandableAddresses && contract.addresses.length > 1
          }
        />
      ))}
    </div>
  )
}

/**
 * Two links both called "Admin" can't be told apart without hovering, so
 * repeated names get a number: "Admin 1", "Admin 2".
 */
function numberRepeatedNames<T extends { name: string }>(entries: T[]): T[] {
  const totals = new Map<string, number>()
  for (const e of entries) totals.set(e.name, (totals.get(e.name) ?? 0) + 1)
  const seen = new Map<string, number>()
  return entries.map((e) => {
    if ((totals.get(e.name) ?? 0) < 2) return e
    const n = (seen.get(e.name) ?? 0) + 1
    seen.set(e.name, n)
    return { ...e, name: `${e.name} ${n}` }
  })
}
