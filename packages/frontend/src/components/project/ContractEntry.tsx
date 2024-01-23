import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import cx from 'classnames'
import React from 'react'

import { BulletIcon } from '../icons/symbols/BulletIcon'
import { Link } from '../Link'
import { Markdown } from '../Markdown'
import { UnverifiedContractsWarning } from '../table/UnverifiedContractsWarning'
import { Callout } from './Callout'
import { EtherscanLink } from './EtherscanLink'
import { ReferenceList, TechnologyReference } from './ReferenceList'

export interface TechnologyContract {
  name: string
  addresses: string[]
  chain: string
  etherscanUrl: string
  description?: string
  links: TechnologyContractLinks[]
  upgradeableBy?: string
  upgradeDelay?: string
  upgradeConsiderations?: string
  references?: TechnologyReference[]
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

  const color = areAddressesUnverified || areLinksUnverified ? 'red' : undefined
  const icon =
    areAddressesUnverified || areLinksUnverified ? (
      <UnverifiedContractsWarning
        className="mt-[3px]"
        tooltip="Source code is not verified"
      />
    ) : (
      <BulletIcon className="h-[1em]" />
    )

  addresses.forEach((address) => {
    const manuallyVerified = manuallyVerifiedContractsForChain[address]
    if (manuallyVerified) {
      references.push({
        text: 'Source code',
        href: manuallyVerified,
      })
    }
  })

  return (
    <Callout
      className={cx(color === 'red' ? 'p-4' : 'px-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap items-center gap-x-2">
            <strong>{contract.name}</strong>{' '}
            {contract.addresses.map((address, i) => (
              <EtherscanLink
                address={address}
                etherscanUrl={contract.etherscanUrl}
                key={i}
                className={cx(
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
                className={cx(
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
              {contract.upgradeableBy}
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
          {contract.upgradeConsiderations && (
            <>
              <button
                className="text-link mt-2 text-sm underline"
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
