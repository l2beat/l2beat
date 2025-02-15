import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { EtherscanLink } from '~/components/etherscan-link'
import { CustomLink } from '~/components/link/custom-link'
import { Markdown } from '~/components/markdown/markdown'
import { externalLinks } from '~/consts/external-links'
import { ChevronIcon } from '~/icons/chevron'
import type { ZkCatalogProjectDetails } from '../_utils/get-zk-catalog-project-details'
import { LastUsedCell } from './last-used-cell'
import { SubVerifiersTable } from './sub-verifiers-table'
import { VerifiedCell } from './verified-cell'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <Accordion type="multiple" asChild>
      <table className="w-full">
        <thead>
          <tr className="border-b border-divider align-bottom text-secondary">
            <th className="px-4 py-2 text-start text-xs font-medium uppercase">
              Name
            </th>
            <th className="hidden py-2 pr-4 text-start text-xs font-medium uppercase md:table-cell">
              Verifier
            </th>
            <th className="py-2 pr-4 text-start text-xs font-medium uppercase">
              Verification status
            </th>
            <th className="hidden py-2 pr-4 text-start text-xs font-medium uppercase md:table-cell">
              Last used
            </th>
            <th />
          </tr>
        </thead>
        {props.items.map((item) => (
          <AccordionItem
            key={`${item.contractAddress.toString()}-${+item.chainId}`}
            value={`${item.contractAddress.toString()}-${+item.chainId}`}
            asChild
          >
            <tbody
              className="border-b border-divider transition-colors last:border-none"
              key={item.contractAddress.toString()}
            >
              <AccordionHeader asChild>
                <AccordionTrigger asChild>
                  <tr className="group/trigger h-14 cursor-pointer">
                    <td className="px-4 text-base font-medium md:text-lg">
                      {item.name}
                    </td>
                    <td className="hidden pr-4 text-sm md:table-cell md:text-base">
                      <EtherscanLink
                        href={item.url}
                        address={item.contractAddress.toString()}
                      />
                    </td>
                    <td className="pr-4">
                      <VerifiedCell {...item} />
                    </td>
                    <td className="hidden pr-4 md:table-cell">
                      <LastUsedCell days={item.lastUsedDaysAgo} />
                    </td>
                    <td className="pr-4">
                      <ChevronIcon className="transition-transform duration-300 ease-out group-data-[state=open]/trigger:rotate-180" />
                    </td>
                  </tr>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent asChild>
                <tr>
                  <td
                    colSpan={100}
                    className="mt-1 space-y-5 px-4 pb-5 md:hidden"
                  >
                    {item.verified === 'no' ? (
                      <CustomLink
                        href={externalLinks.askForZkCatalogVerification}
                      >
                        Submit or ask for verification
                      </CustomLink>
                    ) : null}
                    {item.verified !== 'no' && item.performedBy ? (
                      <p>
                        Verification performed by{' '}
                        <CustomLink href={item.performedBy.link}>
                          {item.performedBy.name}
                        </CustomLink>
                      </p>
                    ) : null}
                    <div>
                      <p className="mb-2 text-xs font-medium text-secondary">
                        Verifier
                      </p>
                      <EtherscanLink
                        address={item.contractAddress.toString()}
                        className="break-all"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-secondary">
                        Last used
                      </p>
                      <LastUsedCell days={item.lastUsedDaysAgo} />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-secondary">
                        Description
                      </p>
                      <Markdown className="text-xs">
                        {item.description}
                      </Markdown>
                    </div>
                    <SubVerifiersTable
                      verifier={item}
                      className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_176px)]"
                    />
                  </td>
                  <td
                    colSpan={100}
                    className="mt-1 hidden w-[90%] space-y-5 px-4 pb-5 md:table-cell"
                  >
                    <div>
                      <p className="mb-2 text-xs font-medium text-secondary">
                        Description
                      </p>
                      <Markdown className="text-xs font-medium text-zinc-900/80 dark:text-white/80">
                        {item.description}
                      </Markdown>
                    </div>
                    <SubVerifiersTable
                      verifier={item}
                      className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_176px)]"
                    />
                  </td>
                </tr>
              </AccordionContent>
            </tbody>
          </AccordionItem>
        ))}
      </table>
    </Accordion>
  )
}
