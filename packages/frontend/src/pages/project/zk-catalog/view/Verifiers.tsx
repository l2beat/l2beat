import React from 'react'

import { assertUnreachable } from '@l2beat/shared-pure'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { ChevronDownIcon } from '../../../../components/icons'
import { CircleQuestionMark } from '../../../../components/icons/symbols/CircleQuestionMark'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <table className="w-full" data-role="accordion" data-type="multiple">
      <thead>
        <tr className="border-b border-gray-200 dark:border-zinc-700 align-bottom">
          <th className="px-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
            Name
          </th>
          <th className="pr-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 hidden md:table-cell">
            Verifier
          </th>
          <th className="pr-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
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
            <td className="px-4 text-base md:text-lg font-medium">
              {item.name}
            </td>
            <td className="pr-4 hidden md:table-cell text-sm md:text-base">
              <EtherscanLink address={item.contractAddress.toString()} />
            </td>
            <td className="pr-4">
              <VerifiedCell verified={item.verified} />
            </td>
            <td className="pr-4">
              <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:-rotate-180" />
            </td>
          </tr>
          <tr
            data-role="accordion-content"
            className="hidden group-data-[open]/accordion-item:table-row border-b border-gray-200 dark:border-zinc-700"
          >
            {/* TODO: Check why w-[90%] fixes header altering */}
            <td
              colSpan={3}
              className="md:hidden px-4 pb-5 mt-1 w-[90%] space-y-5"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Verifier
                </p>
                <EtherscanLink
                  address={item.contractAddress.toString()}
                  className="break-all"
                  truncate={false}
                />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Description
                </p>
                <Markdown>{item.description}</Markdown>
              </div>
              <SubVerifiersTable verifier={item} />
              {item.verified === 'no' ? (
                <div>
                  <Link>Ask for verification</Link>
                </div>
              ) : null}
            </td>
            <td
              colSpan={4}
              className="hidden md:table-cell px-4 pb-5 mt-1 w-[90%] space-y-5"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Description
                </p>
                <Markdown>{item.description}</Markdown>
              </div>
              <SubVerifiersTable verifier={item} />
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}

function SubVerifiersTable({
  verifier,
}: { verifier: ZkCatalogProjectDetails['verifiers'][number] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 align-bottom text-left">
          <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500">
            Proof system
          </th>
          <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500">
            Trusted setup
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {verifier.subVerfiers.map((sV) => (
          <tr
            className="h-8 text-sm border-b last:border-none border-gray-200"
            key={`${sV.proofSystem}-${sV.trustedSetup}`}
          >
            <td className="pr-3">{sV.proofSystem}</td>
            <td className="pr-3">{sV.trustedSetup}</td>
            <td>
              <Link>Source code</Link>
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
        <span className="text-green-700 text-sm md:text-base dark:text-green-450 flex items-center">
          <VerifiedIcon className="mr-1.5 dark:fill-green-450" />
          <span>Successful</span>
        </span>
      )
    case 'no':
      return (
        <span className="flex items-center text-sm md:text-base">
          <CircleQuestionMark className="mr-1.5" />
          {/* TODO: Ask for link */}
          Not verified
          <Link className="ml-4 hidden md:inline">Ask for verification</Link>
        </span>
      )
    case 'failed':
      return (
        <span className="text-red-700 dark:text-red-300 flex items-center text-sm md:text-base">
          <UnverifiedIcon className="mr-1.5" />
          Unsuccessful
        </span>
      )
    default:
      assertUnreachable(verified)
  }
}
