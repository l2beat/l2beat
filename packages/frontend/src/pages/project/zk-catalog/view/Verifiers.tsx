import { ProofVerification } from '@l2beat/config/build/src/projects/types'
import React from 'react'

import { ChevronDownIcon } from '../../../../components/icons'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'
import { assertUnreachable } from '@l2beat/shared-pure'
import { Link } from '../../../../components/Link'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'

interface Props {
  items: ProofVerification['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="h-8 border-b border-gray-200">
          <th className="pl-5 text-start text-xs font-semibold uppercase text-zinc-500">
            Name
          </th>
          <th className="text-start text-xs font-semibold uppercase text-zinc-500">
            Verifier
          </th>
          <th className="text-start text-xs font-semibold uppercase text-zinc-500">
            Verification status
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr
            className="h-14 border-b border-gray-200"
            key={item.contractAddress.toString()}
          >
            <td className="pl-5 text-lg font-medium">{item.name}</td>
            <td>
              <EtherscanLink address={item.contractAddress.toString()} />
            </td>
            <td>
              <VerifiedCell verified={item.verified} />
            </td>
            <td>
              <ChevronDownIcon />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function VerifiedCell({ verified }: { verified: 'yes' | 'no' | 'failed' }) {
  switch (verified) {
    case 'yes':
      return (
        <span className="text-green-700 flex items-center">
          <VerifiedIcon className="mr-1.5 inline" />
          Successful
        </span>
      )
    case 'no':
      return (
        <span>
          Not verified <Link className="ml-4">Ask for verification</Link>
        </span>
      )
    case 'failed':
      return (
        <span className="text-red-700 flex items-center">
          <UnverifiedIcon className="mr-1.5 inline" />
          Unsuccessful
        </span>
      )
    default:
      assertUnreachable(verified)
  }
}
