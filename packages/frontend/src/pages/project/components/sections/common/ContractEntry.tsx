import {
  ManuallyVerifiedContracts,
  ProjectId,
  VerificationStatus,
} from '@l2beat/shared-pure'
import React from 'react'

import { Callout, CalloutProps } from '../../../../../components/Callout'
import { Link } from '../../../../../components/Link'
import { Markdown } from '../../../../../components/Markdown'
import { ShieldIcon } from '../../../../../components/icons'
import { BulletIcon } from '../../../../../components/icons/symbols/BulletIcon'
import { UnverifiedIcon } from '../../../../../components/icons/symbols/UnverifiedIcon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../../components/tooltip/Tooltip'
import { cn } from '../../../../../utils/cn'
import { EtherscanLink } from '../ContractsSection/EtherscanLink'
import { ReferenceList, TechnologyReference } from './ReferenceList'

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
  addresses: string[]
  chain: string
  etherscanUrl: string
  description?: string
  links: TechnologyContractLinks[]
  upgradeableBy?: string[]
  upgradeDelay?: string
  usedInProjects?: UsedInProject[]
  upgradeConsiderations?: string
  references?: TechnologyReference[]
  implementationHasChanged?: boolean
}

export interface TechnologyContractLinks {
  name: string
  href: string
  address: string
  isAdmin: boolean
}
export interface ContractEntryProps {
  contract: TechnologyContract
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  type: 'permission' | 'contract'
  className?: string
}

export function ContractEntry({
  contract,
  verificationStatus,
  manuallyVerifiedContracts,
  type,
  className,
}: ContractEntryProps) {
  const verificationStatusForChain =
    verificationStatus.contracts[contract.chain] ?? {}
  const manuallyVerifiedContractsForChain =
    manuallyVerifiedContracts[contract.chain] ?? {}

  const addresses = contract.addresses
  const references = contract.references ?? []

  const isAnyLinkUnverified = contract.links
    .filter((c) => !c.isAdmin)
    .some((c) => verificationStatusForChain[c.address] === false)
  const isAnyAddressUnverified = addresses.some(
    (c) => verificationStatusForChain[c] === false,
  )

  const isEveryAddressUnverified = addresses.some(
    (c) => verificationStatusForChain[c] === false,
  )
  const isEveryLinkUnverified = contract.links.some(
    (c) => verificationStatusForChain[c.address] === false,
  )

  let color: CalloutProps['color'] = undefined

  const showRedBackground =
    (type === 'contract' && (isAnyAddressUnverified || isAnyLinkUnverified)) ||
    (type === 'permission' && isEveryAddressUnverified && isEveryLinkUnverified)

  if (showRedBackground) {
    color = 'red'
  }

  let icon = <BulletIcon className="h-[1em]" />
  if (contract.implementationHasChanged) {
    icon = <ShieldIcon className={cn('fill-yellow-700 dark:fill-yellow-300')} />
  }
  if (showRedBackground) {
    icon = <UnverifiedIcon className="fill-red-300" />
  }

  addresses.forEach((address) => {
    const manuallyVerified = manuallyVerifiedContractsForChain[address]
    if (manuallyVerified) {
      references.push({
        text: 'Source code',
        href: manuallyVerified,
      })
    }
  })

  const sharedProxies = (contract.usedInProjects ?? []).filter(
    (c) => c.type === 'proxy',
  )
  const sharedImplementations = (contract.usedInProjects ?? [])
    .filter((c) => c.type === 'implementation')
    .filter((c) => !sharedProxies.map((k) => k.id).includes(c.id))
  const sharedPermissions = (contract.usedInProjects ?? []).filter(
    (c) => c.type === 'permission',
  )

  return (
    <Callout
      className={cn(color === undefined ? 'px-4' : 'p-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2">
            <strong id={contract.name}>{contract.name}</strong>{' '}
            {contract.addresses.map((address, i) => {
              const isUnverified = verificationStatusForChain[address] === false

              return (
                <EtherscanLink
                  key={i}
                  address={address}
                  etherscanUrl={contract.etherscanUrl}
                  type={isUnverified ? 'danger' : undefined}
                  className="flex items-center gap-0.5"
                >
                  {isUnverified && !showRedBackground ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <UnverifiedIcon className="fill-red-300" />
                      </TooltipTrigger>
                      <TooltipContent>
                        This contract is not verified
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </EtherscanLink>
              )
            })}
            {contract.links.map((contract, i) => {
              const isUnverified =
                verificationStatusForChain[contract.address] === false

              return (
                <Link
                  key={i}
                  data-role="etherscan-link"
                  type={isUnverified ? 'danger' : undefined}
                  href={contract.href}
                  className="flex items-center gap-0.5"
                >
                  {isUnverified && !showRedBackground ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <UnverifiedIcon className="fill-red-300" />
                      </TooltipTrigger>
                      <TooltipContent>
                        This contract is not verified
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                  {contract.name}
                </Link>
              )
            })}
          </div>
          {contract.description && (
            <Markdown className="mt-2 text-gray-850 leading-snug dark:text-gray-400">
              {contract.description}
            </Markdown>
          )}
          {contract.upgradeableBy && contract.upgradeableBy.length > 0 && (
            <div className="mt-2 flex flex-wrap text-gray-850 dark:text-gray-400">
              <strong className="mr-1.5 text-black dark:text-white">
                Can be upgraded by:
              </strong>
              <div className="flex flex-wrap gap-x-1.5">
                {contract.upgradeableBy.map((name) => (
                  <Link key={name} href={`#${name}`}>
                    {name}
                  </Link>
                ))}
              </div>
            </div>
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
              label={'Implementation used in'}
              implementations={sharedImplementations}
            />
          )}
          {sharedPermissions.length !== 0 && (
            <UsedInProjectEntry
              label={'Used in'}
              implementations={sharedPermissions}
            />
          )}
          {contract.upgradeConsiderations && (
            <>
              <button
                className="mt-2 text-sm underline"
                data-component="upgrade-description-button"
              >
                Show upgrade details
              </button>
              {/* TODO: remove leading once line heights are fixed for all text on the page */}
              <Markdown className="mt-2 hidden text-gray-850 text-sm leading-snug dark:text-gray-400">
                {contract.upgradeConsiderations}
              </Markdown>
            </>
          )}
          {references.length > 0 && (
            <ReferenceList references={references} tight />
          )}
        </>
      }
    />
  )
}

function UsedInProjectEntry({
  label,
  implementations,
}: { label: string; implementations: UsedInProject[] }) {
  return (
    <div className="mt-2 flex flex-row items-center">
      <p className="text-gray-850 dark:text-gray-400">
        <strong className="text-black dark:text-white">{label}</strong>
        {': '}
      </p>
      <div className="flex flex-row items-center">
        {implementations.map((project, i) => (
          <Tooltip key={i} disabledOnMobile>
            <TooltipTrigger>
              <a
                href={`/${project.hrefRoot}/projects/${project.slug}/#${project.targetName}`}
              >
                <img
                  key={i}
                  src={project.iconPath}
                  alt="Project icon"
                  className="mx-1 inline h-5 w-5"
                />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <div>{project.name}</div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
