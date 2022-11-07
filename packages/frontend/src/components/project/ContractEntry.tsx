import { VerificationStatus } from '@l2beat/types'
import cx from 'classnames'
import React from 'react'

import { BulletIcon } from '../icons/symbols/BulletIcon'
import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { OutLink } from '../OutLink'
import { Callout } from './Callout'
import { EtherscanLink } from './EtherscanLink'

export interface TechnologyContract {
  name: string
  address?: string
  description?: string
  links: {
    name: string
    href: string
    address: string
  }[]
}

export interface ContractEntryProps {
  key: number
  contract: TechnologyContract
  verificationStatus: VerificationStatus
}

export function ContractEntry({
  key,
  contract,
  verificationStatus,
}: ContractEntryProps) {
  const areLinksUnverified = contract.links
    .map((c) => verificationStatus.contracts[c.address])
    .some((c) => c === false)

  const isVerified = contract.address
    ? verificationStatus.contracts[contract.address]
    : undefined

  const color = isVerified === false || areLinksUnverified ? 'red' : undefined
  const icon =
    isVerified === false || areLinksUnverified ? (
      <UnverifiedIcon className={cx('fill-red-700 dark:fill-red-300')} />
    ) : (
      <BulletIcon></BulletIcon>
    )

  return (
    <div key={key}>
      <Callout
        color={color}
        icon={icon}
        body={
          <div className="flex gap-y-2 flex-wrap">
            <div className="flex gap-x-2 flex-wrap">
              <strong>{contract.name}</strong>{' '}
              {contract.address && (
                <EtherscanLink
                  address={contract.address}
                  className={cx(
                    isVerified === false
                      ? 'text-red-700 dark:text-red-300'
                      : '',
                  )}
                />
              )}
              <div className="flex gap-x-1 flex-wrap">
                {contract.links.map((x, i) => (
                  <React.Fragment key={i}>
                    {' '}
                    <OutLink
                      className={cx(
                        'text-link underline',
                        verificationStatus.contracts[x.address] === false
                          ? 'text-red-700 dark:text-red-300'
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
      />
    </div>
  )
}
