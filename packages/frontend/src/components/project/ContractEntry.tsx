import { VerificationStatus } from '@l2beat/shared'
import cx from 'classnames'
import React from 'react'

import { BulletIcon } from '../icons/symbols/BulletIcon'
import { OutLink } from '../OutLink'
import { UnverifiedContractsWarning } from '../table/UnverifiedContractsWarning'
import { Callout } from './Callout'
import { EtherscanLink } from './EtherscanLink'

export interface TechnologyContract {
  name: string
  addresses?: string[]
  description?: string
  links: TechnologyContractLinks[]
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
  className?: string
}

export function ContractEntry({
  contract,
  verificationStatus,
  className,
}: ContractEntryProps) {
  const areLinksUnverified = contract.links
    .filter((c) => !c.isAdmin)
    .map((c) => verificationStatus.contracts[c.address])
    .some((c) => c === false)

  const areAddressesUnverified = (contract.addresses ?? [])
    .map((c) => verificationStatus.contracts[c])
    .some((c) => c === false)

  const color = areAddressesUnverified || areLinksUnverified ? 'red' : undefined
  const icon =
    areAddressesUnverified || areLinksUnverified ? (
      <UnverifiedContractsWarning
        className="mt-[3px]"
        tooltip="Source code is not verified"
      />
    ) : (
      <BulletIcon className="h-6 md:h-[27px]" />
    )

  return (
    <Callout
      className={cx(color === 'red' ? 'p-4' : 'px-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap gap-x-2">
            <strong>{contract.name}</strong>{' '}
            {(contract.addresses ?? []).map((address, i) => (
              <EtherscanLink
                address={address}
                key={i}
                className={cx(
                  verificationStatus.contracts[address] === false
                    ? 'text-red-700 dark:text-red-300'
                    : '',
                )}
              />
            ))}
            {contract.links.map((x, i) => (
              <OutLink
                key={i}
                className={cx(
                  'text-link underline',
                  verificationStatus.contracts[x.address] === false &&
                    !x.isAdmin
                    ? 'text-red-700 dark:text-red-300'
                    : '',
                )}
                href={x.href}
              >
                {x.name}
              </OutLink>
            ))}
          </div>
          {contract.description && (
            <div className="mt-2">
              <p className="text-gray-850 dark:text-gray-400">
                {contract.description}
              </p>
            </div>
          )}
        </>
      }
    />
  )
}
