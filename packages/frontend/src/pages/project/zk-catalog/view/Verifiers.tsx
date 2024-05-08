import { ProofVerification } from '@l2beat/config'
import React from 'react'

import { assertUnreachable } from '@l2beat/shared-pure'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { ChevronDownIcon } from '../../../../components/icons'
import { CircleQuestionMark } from '../../../../components/icons/symbols/CircleQuestionMark'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'

interface Props {
  items: ProofVerification['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <table className="w-full" data-role="accordion" data-type="multiple">
      <thead>
        <tr className="h-8 border-b border-gray-200 dark:border-zinc-700">
          <th className="pl-5 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
            Name
          </th>
          <th className="text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
            Verifier
          </th>
          <th className="text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
            Verification status
          </th>
          <th />
        </tr>
      </thead>
      {props.items.map((item) => (
        <tbody
          data-role="accordion-item"
          className="group/accordion-item hover:!bg-zinc-100 dark:hover:!bg-neutral-800 data-[open]:bg-gray-100 dark:data-[open]:bg-zinc-900 transition-colors"
          key={item.contractAddress.toString()}
        >
          <tr
            data-role="accordion-trigger"
            className="h-14 border-b border-gray-200 dark:border-zinc-700 cursor-pointer group-data-[open]/accordion-item:border-none"
          >
            <td className="pl-5 md:text-lg font-medium">{item.name}</td>
            <td>
              <EtherscanLink address={item.contractAddress.toString()} />
            </td>
            <td>
              <VerifiedCell verified={item.verified} />
            </td>
            <td className="pr-5">
              <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:-rotate-180" />
            </td>
          </tr>
          <tr
            data-role="accordion-content"
            className="hidden group-data-[open]/accordion-item:table-row border-b border-gray-200 dark:border-zinc-700"
          >
            {/* TODO: Check why w-[90%] fixes header altering */}
            <td colSpan={4} className="px-5 pb-5 mt-1 w-[90%]">
              <span className="text-gray-500 dark:text-gray-50 text-xs font-medium">
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
        <span className="text-green-700 text-base dark:text-green-450 flex items-center">
          <VerifiedIcon className="mr-1.5 dark:fill-green-450" />
          <span>Successful</span>
        </span>
      )
    case 'no':
      return (
        <span className="flex items-center text-base">
          <CircleQuestionMark className="mr-1.5" />
          {/* TODO: Ask for link */}
          Not verified <Link className="ml-4">Ask for verification</Link>
        </span>
      )
    case 'failed':
      return (
        <span className="text-red-700 dark:text-red-300 flex items-center text-base">
          <UnverifiedIcon className="mr-1.5" />
          Unsuccessful
        </span>
      )
    default:
      assertUnreachable(verified)
  }
}
