import React from 'react'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { ChevronDownIcon } from '../../../../components/icons'
import {} from '../../../../components/tooltip/Tooltip'
import { getExplorerUrlByChainId } from '../../../../utils/getExplorerUrl'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'
import { LastUsedCell } from './LastUsedCell'
import { SubVerifiersTable } from './SubVerifiersTable'
import { VerifiedCell } from './VerifiedCell'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
  askForVerificationLink: string
}

export function Verifiers(props: Props) {
  return (
    <table className="w-full" data-role="accordion" data-type="multiple">
      <thead>
        <tr className="border-gray-200 border-b align-bottom dark:border-zinc-700">
          <th className="px-4 py-2 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50">
            Name
          </th>
          <th className="hidden py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase md:table-cell dark:text-gray-50">
            Verifier
          </th>
          <th className="py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50">
            Verification status
          </th>
          <th className="hidden py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase md:table-cell dark:text-gray-50">
            Last used
          </th>
          <th />
        </tr>
      </thead>
      {props.items.map((item) => (
        <tbody
          data-role="accordion-item"
          className="group/accordion-item hover:!bg-zinc-100 dark:hover:!bg-neutral-800 transition-colors dark:data-[open]:bg-zinc-900 data-[open]:bg-gray-100"
          key={item.contractAddress.toString()}
        >
          <tr
            data-role="accordion-trigger"
            className="h-14 cursor-pointer border-gray-200 border-b dark:border-zinc-700 group-data-[open]/accordion-item:border-none"
          >
            <td className="px-4 font-medium text-base md:text-lg">
              {item.name}
            </td>
            <td className="hidden pr-4 text-sm md:table-cell md:text-base">
              <EtherscanLink
                etherscanUrl={getExplorerUrlByChainId(item.chainId)}
                address={item.contractAddress.toString()}
              />
            </td>
            <td className="pr-4">
              <VerifiedCell
                verified={item.verified}
                askForVerificationLink={props.askForVerificationLink}
              />
            </td>
            <td className="hidden pr-4 md:table-cell">
              <LastUsedCell days={item.lastUsedDaysAgo} />
            </td>
            <td className="pr-4">
              <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
            </td>
          </tr>
          <tr
            data-role="accordion-content"
            className="hidden border-gray-200 border-b group-data-[open]/accordion-item:table-row dark:border-zinc-700"
          >
            {/* TODO: Check why w-[90%] fixes header altering */}
            <td
              colSpan={3}
              className="mt-1 w-[90%] space-y-5 px-4 pb-5 md:hidden"
            >
              <div>
                <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                  Verifier
                </p>
                <EtherscanLink
                  address={item.contractAddress.toString()}
                  className="break-all"
                />
              </div>
              <div>
                <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                  Last used
                </p>
                <LastUsedCell days={item.lastUsedDaysAgo} />
              </div>
              <div>
                <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                  Description
                </p>
                <Markdown className="text-xs">{item.description}</Markdown>
              </div>
              <SubVerifiersTable
                verifier={item}
                className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)]"
              />
              {item.verified === 'no' ? (
                <Link href={props.askForVerificationLink}>
                  Ask for verification
                </Link>
              ) : null}
            </td>
            <td
              colSpan={5}
              className="mt-1 hidden w-[90%] space-y-5 px-4 pb-5 md:table-cell"
            >
              <div>
                <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                  Description
                </p>
                <Markdown className="font-medium text-xs text-zinc-900/80 dark:text-white/80">
                  {item.description}
                </Markdown>
              </div>
              <SubVerifiersTable
                verifier={item}
                className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)]"
              />
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}
