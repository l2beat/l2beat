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
  type: 'implementation' | 'proxy'
}

export interface TechnologyContract {
  name: string
  addresses: string[]
  chain: string
  etherscanUrl: string
  description?: string
  links: TechnologyContractLinks[]
  upgradeableBy?: string
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
  className?: string
}

export function ContractEntry({
  contract,
  verificationStatus,
  manuallyVerifiedContracts,
  className,
}: ContractEntryProps) {
  const verificationStatusForChain =
    verificationStatus.contracts[contract.chain] ?? {}
  const manuallyVerifiedContractsForChain =
    manuallyVerifiedContracts[contract.chain] ?? {}

  const areLinksUnverified = contract.links
    .filter((c) => !c.isAdmin)
    .map((c) => verificationStatusForChain[c.address])
    .some((c) => c === false)

  const addresses = contract.addresses
  const references = contract.references ?? []

  const areAddressesUnverified = addresses
    .map((c) => verificationStatusForChain[c])
    .some((c) => c === false)

  let color: CalloutProps['color'] = undefined

  if (areAddressesUnverified || areLinksUnverified) {
    color = 'red'
  }

  let icon = <BulletIcon className="h-[1em]" />
  if (contract.implementationHasChanged) {
    icon = <ShieldIcon className={cn('fill-yellow-700 dark:fill-yellow-300')} />
  }
  if (areAddressesUnverified || areLinksUnverified) {
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
              <EtherscanLink
                address={address}
                etherscanUrl={contract.etherscanUrl}
                key={i}
                className={cn(
                  verificationStatusForChain[address] === false
                    ? 'text-red-300'
                    : '',
                )}
              />
            ))}
            {contract.links.map((x, i) => (
              <Link
                data-role="etherscan-link"
                key={i}
                className={cn(
                  verificationStatusForChain[x.address] === false &&
                    !x.isAdmin &&
                    'text-red-300',
                )}
                href={x.href}
              >
                {x.name}
              </Link>
            ))}
          </div>
          {contract.description && (
            <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
              {contract.description}
            </Markdown>
          )}
          {contract.upgradeableBy && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
              <strong className="text-black dark:text-white">
                Can be upgraded by:
              </strong>{' '}
              <Link href={`#${contract.upgradeableBy}`}>
                {contract.upgradeableBy}
              </Link>
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
              label="Used in projects (proxies)"
              implementations={sharedProxies}
              contractName={contract.name}
            />
          )}
          {sharedImplementations.length !== 0 && (
            <UsedInProjectEntry
              label="Used in projects (implementations)"
              implementations={sharedImplementations}
              contractName={contract.name}
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
              <Markdown className="mt-2 hidden text-sm leading-snug text-gray-850 dark:text-gray-400">
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
  contractName,
}: { label: string; implementations: UsedInProject[]; contractName: string }) {
  return (
    <div className="mt-2 flex flex-row items-center">
      <p className="text-gray-850 dark:text-gray-400">
        <strong className="text-black dark:text-white">{label}</strong>
        {': '}
      </p>
      <div className="flex flex-row items-center">
        {implementations.map((project, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <a href={`/scaling/projects/${project.slug}/#${contractName}`}>
                <img
                  key={i}
                  src={project.iconPath}
                  alt="Project icon"
                  className="h-5 w-5 mx-1 inline"
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
