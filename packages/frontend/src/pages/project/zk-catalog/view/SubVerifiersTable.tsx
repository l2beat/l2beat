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
          <tr className="border-gray-200 border-b text-left align-bottom dark:border-zinc-700">
            <th className="py-1.5 pr-3 font-semibold text-2xs text-gray-500 uppercase dark:text-gray-50">
              Name
            </th>
            <th className="py-1.5 pr-3 font-semibold text-2xs text-gray-500 uppercase dark:text-gray-50">
              Proof system
            </th>
            <th className="py-1.5 pr-3 font-semibold text-2xs text-gray-500 uppercase dark:text-gray-50">
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
            <th className="py-1.5 pr-3 font-semibold text-2xs text-gray-500 uppercase dark:text-gray-50">
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
            <th className="py-1.5 pr-3 font-semibold text-2xs text-gray-500 uppercase dark:text-gray-50">
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
            <th className="py-1.5 pr-3 font-semibold text-2xs text-gray-500 uppercase dark:text-gray-50">
              Source code
            </th>
          </tr>
        </thead>
        <tbody>
          {verifier.subVerifiers.map((sV) => (
            <tr
              className="h-8 border-gray-200 border-b text-sm dark:border-zinc-700 last:border-none *:pr-3"
              key={`${sV.proofSystem}-${sV.trustedSetup}`}
            >
              <td>{sV.name}</td>
              <td>{sV.proofSystem}</td>
              <td>{sV.mainArithmetization}</td>
              <td>{sV.mainPCS}</td>
              <td>{sV.trustedSetup ?? '?'}</td>
              <td>{sV.link ? <Link href={sV.link}>Link</Link> : EM_DASH}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
