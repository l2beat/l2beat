import { VerificationStatus } from '@l2beat/types'
import React from 'react'

import { OutLink } from '../OutLink'
import { UnverifiedContractsWarning } from '../table/UnverifiedContractsWarning'
import { EtherscanLink } from './EtherscanLink'

export interface TechnologyContract {
  name: string
  address: string
  description?: string
  links: {
    name: string
    href: string
    address: string
  }[]
}

export interface ContractEntryProps {
  contract: TechnologyContract
  verificationStatus: VerificationStatus
}

export function ContractEntry({
  contract,
  verificationStatus,
}: ContractEntryProps) {
  const areLinksUnverified = contract.links
    .map((c) => verificationStatus.contracts[c.address])
    .some((c) => c === false)

  const isVerified = verificationStatus.contracts[contract.address]

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <strong>{contract.name}</strong>{' '}
        <EtherscanLink address={contract.address} />
        <div className="flex gap-1">
          {contract.links.map((x, i) => (
            <React.Fragment key={i}>
              {' '}
              <OutLink className="text-link underline" href={x.href}>
                {x.name}
              </OutLink>
            </React.Fragment>
          ))}
          {isVerified === false ||
            (areLinksUnverified && (
              <UnverifiedContractsWarning
                className={'absolute translate-y-1/4'}
                tooltip="Source code is not verified."
              ></UnverifiedContractsWarning>
            ))}
        </div>
      </div>
      {contract.description && (
        <div>
          <p className="text-gray-860 dark:text-gray-400">
            {contract.description}
          </p>
        </div>
      )}
    </>
  )
}
