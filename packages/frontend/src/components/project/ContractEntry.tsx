import { VerificationStatus } from '@l2beat/types'
import cx from 'classnames'
import React from 'react'

import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { OutLink } from '../OutLink'
import { UnverifiedContractsWarning } from '../table/UnverifiedContractsWarning'
import { Callout } from './Callout'
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

  return isVerified === false || areLinksUnverified ? (
    <Callout
      color="red"
      icon={<UnverifiedIcon className={cx('fill-red-700 dark:fill-red-300')} />}
      body={
        <div>
          <div className="flex gap-2 flex-wrap">
            <strong>{contract.name}</strong>{' '}
            <EtherscanLink
              address={contract.address}
              className={cx(isVerified === false ? 'text-red-300' : '')}
            />
            <div className="flex gap-1">
              {contract.links.map((x, i) => (
                <React.Fragment key={i}>
                  {' '}
                  <OutLink
                    className={cx(
                      'text-link underline',
                      verificationStatus.contracts[x.address] === false
                        ? 'text-red-300'
                        : '',
                    )}
                    href={x.href}
                  >
                    {x.name}
                  </OutLink>
                </React.Fragment>
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
        </div>
      }
    ></Callout>
  ) : (
    <div>verified</div>
  )
}
