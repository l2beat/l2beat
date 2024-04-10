import React from 'react'

import { SatisfiedIcon } from './icons'
import { CopyIcon } from './icons/symbols/CopyIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip/Tooltip'

interface Props {
  toCopy: string
}

export function CopyButton(props: Props) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <button
            data-role="copy-button"
            className="group flex items-center justify-center"
            data-to-copy={props.toCopy}
          >
            <CopyIcon className="size-6 fill-blue-700 hover:fill-blue-600 group-data-[copied=true]:hidden dark:fill-blue-500 dark:hover:fill-blue-550" />
            <SatisfiedIcon className="hidden size-6 fill-green-700 group-data-[copied=true]:block dark:fill-green-450" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Copy URL</TooltipContent>
      </Tooltip>
    </>
  )
}
