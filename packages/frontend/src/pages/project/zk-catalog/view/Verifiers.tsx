import { ProofVerification } from '@l2beat/config/build/src/projects/types'
import React from 'react'

import { assertUnreachable } from '@l2beat/shared-pure'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { ChevronDownIcon } from '../../../../components/icons'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'

interface Props {
  items: ProofVerification['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <table className="w-full" data-role="accordion" data-type="single">
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
      {props.items.map((item) => (
        <tbody
          data-role="accordion-item"
          className="group/accordion-item"
          key={item.contractAddress.toString()}
        >
          <tr
            data-role="accordion-trigger"
            className="h-14 border-b hover:bg-[#E9ECF2] transition-colors border-gray-200 cursor-pointer"
          >
            <td className="pl-5 text-lg font-medium">{item.name}</td>
            <td>
              <EtherscanLink address={item.contractAddress.toString()} />
            </td>
            <td>
              <VerifiedCell verified={item.verified} />
            </td>
            <td>
              <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:-rotate-180" />
            </td>
          </tr>
          <tr
            data-role="accordion-content"
            className="hidden group-data-[open]/accordion-item:table-row bg-gray-100"
          >
            {/* TODO: Check why w-[90%] fixes header altering */}
            <td colSpan={4} className="p-5 w-[90%]">
              <span className="text-gray-500 text-xs font-medium">
                Description
              </span>
              <Markdown className="mt-2">{item.description}</Markdown>
            </td>
          </tr>
        </tbody>
      ))}
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
