import type {
  ProjectPermissionImpactScenario,
  ProjectPermissionOrigin,
  ProjectUpgradeableActor,
  ReferenceLink,
} from '@l2beat/config'
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
import { PermissionDescription } from './permissions/PermissionDescription'
import { UpgradeConsiderations } from './permissions/UpgradeConsiderations'
import type { UsedInProject } from './permissions/UsedInProject'
import { UsedInProjectEntry } from './permissions/UsedInProject'
import { ReferenceList } from './ReferenceList'

export interface TechnologyContract {
  id: string
  name: string
  addresses: TechnologyContractAddress[]
  admins: TechnologyContractAddress[]
  chain: string
  description?: string
  impactScenarios?: ProjectPermissionImpactScenario[]
  permissionOrigins?: TechnologyContractPermissionOrigin[]
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

export type TechnologyContractPermissionOrigin = ProjectPermissionOrigin & {
  project?: {
    name: string
    icon: string
  }
}

export interface TechnologyContractAddress {
  name: string
  href: string
  address: string
  verificationStatus: VerificationStatus
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
  descriptionType?: 'default' | 'permission'
}

export function ContractEntry({
  contract,
  className,
  expandableAddresses = false,
  descriptionType = 'default',
}: ContractEntryProps) {
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
              id={contract.id}
              className="word-break-word scroll-mt-14 md:scroll-mt-10"
            >
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
            {descriptionType === 'permission' &&
              contract.permissionOrigins?.map((origin) => (
                <PermissionOriginBadge
                  key={permissionOriginKey(origin)}
                  origin={origin}
                />
              ))}
            {expandableAddresses ? (
              <GroupedActorAddresses
                addresses={contract.addresses}
                className="basis-full"
              />
            ) : (
              entries.map((address, i) => (
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
              ))
            )}
          </div>
          {contract.pastUpgrades?.upgrades &&
            contract.pastUpgrades.upgrades.length > 0 && (
              <PastUpgradesDialog pastUpgrades={contract.pastUpgrades} />
            )}
          {contract.description &&
            (descriptionType === 'permission' ? (
              <PermissionDescription
                className="mt-2"
                impactScenarios={contract.impactScenarios}
              >
                {contract.description}
              </PermissionDescription>
            ) : (
              <Markdown className="word-break-word mt-2 text-paragraph-15 md:text-paragraph-16">
                {contract.description}
              </Markdown>
            ))}
          {contract.escrow && <EscrowDetailsEntry escrow={contract.escrow} />}
          {contract.upgradeableBy && contract.upgradeableBy.length > 0 && (
            <div className="mt-2 flex flex-wrap text-paragraph-15 md:text-paragraph-16">
              <strong className="text-primary">Can be upgraded by:</strong>
              <div className="ml-1.5 flex flex-wrap gap-1.5">
                {contract.upgradeableBy.map((entry) =>
                  entry.unreachable ? (
                    <span
                      key={entry.name}
                      className={linkVariants({
                        variant: 'plain',
                        underline: false,
                      })}
                    >
                      {`${entry.name} with ${entry.delay} delay`}
                    </span>
                  ) : (
                    <a
                      key={entry.name}
                      className={linkVariants()}
                      href={`#${entry.id ?? entry.name}`}
                    >
                      {`${entry.name} with ${entry.delay} delay`}
                    </a>
                  ),
                )}
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

function PermissionOriginBadge({
  origin,
}: {
  origin: TechnologyContractPermissionOrigin
}) {
  if (origin.type === 'project') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-surface-info px-1.5 py-1 font-medium text-label-value-13 text-link leading-none">
        {origin.project && (
          <img
            src={origin.project.icon}
            alt=""
            className="size-3.5 rounded-full bg-white"
          />
        )}
        This project
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-surface-secondary px-1.5 py-1 text-label-value-13 leading-none">
      <span className="text-secondary">Dependency</span>
      <span className="inline-flex min-w-0 items-center gap-1 font-medium text-primary">
        {origin.project && (
          <img
            src={origin.project.icon}
            alt=""
            className="size-3.5 rounded-full bg-white"
          />
        )}
        {origin.project?.name ?? formatDependencyName(origin.name)}
      </span>
    </span>
  )
}

function permissionOriginKey(origin: ProjectPermissionOrigin): string {
  return origin.type === 'project'
    ? origin.type
    : `${origin.type}:${origin.name}`
}

function formatDependencyName(name: string): string {
  if (name.includes(' ') || /[A-Z]/.test(name)) {
    return name
  }
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function EscrowBadge({ isCustom }: { isCustom?: boolean }) {
  return (
    <Badge
      type="pink"
      padding="regular"
      className="text-[13px] uppercase leading-none"
    >
      {isCustom ? 'Custom Escrow' : 'Escrow'}
    </Badge>
  )
}

function EscrowDetailsEntry({ escrow }: { escrow: TechnologyContractEscrow }) {
  if (escrow.tokens === '*') {
    return (
      <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
        <strong className="text-primary">
          All supported tokens in this escrow are included in the value secured
          calculation.
        </strong>
      </p>
    )
  }

  return (
    <div className="mt-2 flex flex-wrap items-center text-paragraph-15 md:text-paragraph-16">
      <strong className="text-primary">
        The following tokens are included in the value secured calculation:
      </strong>
      <div className="ml-1.5 flex flex-wrap items-center gap-1.5">
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
  expandableAddresses?: boolean
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
          expandableAddresses={
            props.expandableAddresses && contract.addresses.length > 1
          }
          descriptionType={
            props.type === 'permissions' ? 'permission' : 'default'
          }
        />
      ))}
    </div>
  )
}
