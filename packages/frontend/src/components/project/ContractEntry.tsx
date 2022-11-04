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
  }[]
}

export interface ContractEntryProps {
  contract: TechnologyContract
  isVerified?: boolean
}

export function ContractEntry({ contract, isVerified }: ContractEntryProps) {
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <strong>{contract.name}</strong>{' '}
        <EtherscanLink
          address={contract.address}
        />
        {contract.links.map((x, i) => (
          <React.Fragment key={i}>
            {' '}
            <OutLink className="text-link underline" href={x.href}>
              {x.name}
            </OutLink>
          </React.Fragment>
        ))}
        {isVerified === false && (
          <UnverifiedContractsWarning
            className={'absolute translate-y-1/3'}
          ></UnverifiedContractsWarning>
        )}
      </div>
      {contract.description && (
        <p className="text-gray-860 dark:text-gray-400">
          {contract.description}
        </p>
      )}
    </>
  )
}
