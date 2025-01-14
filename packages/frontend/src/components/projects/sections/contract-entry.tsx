import { Callout } from '~/components/callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { linkVariants } from '~/components/link/custom-link'
import { HighlightableLink } from '~/components/link/highlightable/highlightable-link'
import { Markdown } from '~/components/markdown/markdown'
import { BulletIcon } from '~/icons/bullet'
import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { cn } from '~/utils/cn'
import { type VerificationStatus } from '~/utils/project/contracts-and-permissions/to-verification-status'
import { type Participant, ParticipantsEntry } from './permissions/participants'
import { UpgradeConsiderations } from './permissions/upgrade-considerations'
import {
  type UsedInProject,
  UsedInProjectEntry,
} from './permissions/used-in-project'
import { type Reference, ReferenceList } from './reference-list'

export interface TechnologyContract {
  name: string
  addresses: TechnologyContractAddress[]
  chain: string
  description?: string
  upgradeableBy?: string[]
  upgradeDelay?: string
  usedInProjects?: UsedInProject[]
  participants?: Participant[]
  upgradeConsiderations?: string
  references: Reference[]
  implementationChanged: boolean
  highSeverityFieldChanged: boolean
}

export interface TechnologyContractAddress {
  name: string
  href: string
  address: string
  isAdmin: boolean
  verificationStatus: VerificationStatus
}

export interface ContractEntryProps {
  contract: TechnologyContract
  type: 'permission' | 'contract'
  className?: string
}

export function ContractEntry({
  contract,
  type,
  className,
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

  const { color, icon } = getCalloutProps(contract, type)

  return (
    <Callout
      className={cn(color === undefined ? 'px-4' : 'p-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2 !leading-[1.15]">
            <strong id={contract.name}>{contract.name}</strong>{' '}
            {contract.addresses.map((address, i) => (
              <HighlightableLink
                key={i}
                variant={
                  address.verificationStatus === 'unverified'
                    ? 'danger'
                    : undefined
                }
                href={address.href}
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
            <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
              {contract.description}
            </Markdown>
          )}
          {contract.upgradeableBy && contract.upgradeableBy.length > 0 && (
            <div className="mt-2 flex flex-wrap text-gray-850 dark:text-gray-400">
              <strong className="text-primary">Can be upgraded by:</strong>
              <div className="ml-1.5 flex flex-wrap gap-1.5">
                {contract.upgradeableBy.map((name) => (
                  <a key={name} className={linkVariants()} href={`#${name}`}>
                    {name}
                  </a>
                ))}
              </div>
            </div>
          )}
          {contract.upgradeDelay && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
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

function getCalloutProps(
  contract: TechnologyContract,
  type: 'permission' | 'contract',
) {
  const isAnyAddressUnverified = contract.addresses.some(
    (c) => c.verificationStatus === 'unverified' && !c.isAdmin,
  )
  const isEveryAddressUnverified = contract.addresses.every(
    (c) => c.verificationStatus === 'unverified',
  )
  const showRedBackground =
    (type === 'contract' && isAnyAddressUnverified) ||
    (type === 'permission' && isEveryAddressUnverified)

  if (showRedBackground) {
    return {
      color: 'red',
      icon: <UnverifiedIcon className="size-5 fill-red-300" />,
    } as const
  }

  if (contract.implementationChanged || contract.highSeverityFieldChanged) {
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
