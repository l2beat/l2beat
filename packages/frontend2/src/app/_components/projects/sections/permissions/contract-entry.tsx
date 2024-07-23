import React from 'react'
import { Callout } from '~/app/_components/callout'
import { CustomLink } from '~/app/_components/link/custom-link'
import { HighlightableLink } from '~/app/_components/link/highlightable/highlightable-link'
import { Markdown } from '~/app/_components/markdown/markdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import BulletIcon from '~/icons/bullet.svg'
import ShieldIcon from '~/icons/shield.svg'
import UnverifiedIcon from '~/icons/unverified.svg'
import { cn } from '~/utils/cn'
import { ReferenceList, type TechnologyReference } from './reference-list'
import { UpgradeConsiderations } from './upgrade-considerations'
import { type UsedInProject, UsedInProjectEntry } from './used-in-project'

export interface TechnologyContract {
  name: string
  addresses: TechnologyContractAddress[]
  chain: string
  description?: string
  upgradeableBy?: string
  upgradeDelay?: string
  usedInProjects?: UsedInProject[]
  upgradeConsiderations?: string
  references: TechnologyReference[]
  implementationHasChanged?: boolean
}

export interface TechnologyContractAddress {
  name: string
  href: string
  address: string
  isAdmin: boolean
  verified: boolean | undefined
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
                variant={address.verified === false ? 'danger' : undefined}
                href={address.href}
                className="flex items-center gap-0.5"
              >
                {!address.verified && color !== 'red' ? (
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
            <Markdown className="mt-2 text-gray-850 leading-snug dark:text-gray-400">
              {contract.description}
            </Markdown>
          )}
          {contract.upgradeableBy && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
              <strong className="text-black dark:text-white">
                Can be upgraded by:
              </strong>{' '}
              <CustomLink href={`#${contract.upgradeableBy}`}>
                {contract.upgradeableBy}
              </CustomLink>
            </p>
          )}
          {contract.upgradeDelay && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
              <strong className="text-black dark:text-white">
                Upgrade delay:
              </strong>{' '}
              {contract.upgradeDelay}
            </p>
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
    (c) => !c.verified && !c.isAdmin,
  )
  const isEveryAddressUnverified = contract.addresses.every((c) => !c.verified)

  const showRedBackground =
    (type === 'contract' && isAnyAddressUnverified) ||
    (type === 'permission' && isEveryAddressUnverified)

  if (showRedBackground) {
    return {
      color: 'red',
      icon: <UnverifiedIcon className="fill-red-300 size-5" />,
    } as const
  }

  if (contract.implementationHasChanged) {
    return {
      color: undefined,
      icon: (
        <ShieldIcon className="fill-yellow-700 dark:fill-yellow-300 size-5" />
      ),
    }
  }

  return {
    color: undefined,
    icon: <BulletIcon className="size-5" />,
  }
}
