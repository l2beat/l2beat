import React from 'react'
import { Link } from '../../../../components/Link'
import { InfoIcon } from '../../../../components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'
import { cn } from '../../../../utils/cn'
import { EM_DASH } from '../../../../utils/constants'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  verifier: ZkCatalogProjectDetails['verifiers'][number]
  className: string
}

export function SubVerifiersTable({ verifier, className }: Props) {
  return (
    <div
      className={cn(
        'overflow-x-auto whitespace-pre pb-1.5 lg:w-full',
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-zinc-700 align-bottom text-left">
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Name
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              <div className="flex items-center gap-1.5">
                <span>Arithmetization</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="fill-current md:size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shows how the computation is represented mathematically.
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              <div className="flex items-center gap-1.5">
                <span>PCS</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="fill-current md:size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shows what Polynomial Commitment Scheme is used.
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Proof system
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              <div className="flex items-center gap-1.5">
                <span>Trusted setup</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="fill-current md:size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shows if the proof system requires a trusted setup.
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Circuit source
            </th>
          </tr>
        </thead>
        <tbody>
          {verifier.subVerifiers.map((sV) => (
            <tr
              className="h-8 text-sm border-b last:border-none border-gray-200 dark:border-zinc-700 *:pr-3"
              key={`${sV.proofSystem}-${sV.trustedSetup}`}
            >
              <td>{sV.name}</td>
              <td>{sV.proofSystem}</td>
              <td>{sV.mainArithmetization}</td>
              <td>{sV.mainPCS}</td>
              <td>{sV.trustedSetup ?? EM_DASH}</td>
              <td>{sV.link ? <Link href={sV.link}>Link</Link> : EM_DASH}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
