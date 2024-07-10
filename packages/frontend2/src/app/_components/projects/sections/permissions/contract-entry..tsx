import { type ProjectId } from '@l2beat/shared-pure'
import React from 'react'
import { Callout } from '~/app/_components/callout'
import { Markdown } from '~/app/_components/markdown/markdown'
import { cn } from '~/utils/cn'
import { ReferenceList, type TechnologyReference } from './reference-list'
import { CustomLink } from '~/app/_components/custom-link'
import UnverifiedIcon from '~/icons/unverified.svg'
import ShieldIcon from '~/icons/shield.svg'
import BulletIcon from '~/icons/bullet.svg'
import { UpgradeConsiderations } from './upgrade-considerations'
import { UsedInProjectEntry } from './used-in-project'

export interface UsedInProject {
  id: ProjectId
  name: string
  slug: string
  iconPath: string
  targetName: string
  hrefRoot: string
  type: 'implementation' | 'proxy' | 'permission'
}

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
  verified: boolean
}

export interface ContractEntryProps {
  contract: TechnologyContract
  className?: string
}

export function ContractEntry({ contract, className }: ContractEntryProps) {
  const sharedProxies = (contract.usedInProjects ?? []).filter(
    (c) => c.type === 'proxy',
  )
  const sharedImplementations = (contract.usedInProjects ?? [])
    .filter((c) => c.type === 'implementation')
    .filter((c) => !sharedProxies.map((k) => k.id).includes(c.id))
  const sharedPermissions = (contract.usedInProjects ?? []).filter(
    (c) => c.type === 'permission',
  )

  const { color, icon } = getCalloutProps(contract)

  return (
    <Callout
      className={cn(color === undefined ? 'px-4' : 'p-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2">
            <strong id={contract.name}>{contract.name}</strong>{' '}
            {contract.addresses.map((address, i) => (
              <CustomLink
                data-role="etherscan-link"
                key={i}
                variant={
                  !address.verified && !address.isAdmin ? 'danger' : 'primary'
                }
                href={address.href}
              >
                {address.name}
              </CustomLink>
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

function getCalloutProps(contract: TechnologyContract) {
  const areAddressesUnverified = contract.addresses.some((c) => !c.verified)
  const color = areAddressesUnverified ? ('red' as const) : undefined

  if (areAddressesUnverified) {
    return {
      color,
      icon: <UnverifiedIcon className="fill-red-300" />,
    }
  }

  if (contract.implementationHasChanged) {
    return {
      color,
      icon: (
        <ShieldIcon className={cn('fill-yellow-700 dark:fill-yellow-300')} />
      ),
    }
  }

  return {
    color,
    icon: <BulletIcon className="h-[1em]" />,
  }
}
