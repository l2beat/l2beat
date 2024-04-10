import React from 'react'

import { cn } from '../utils/cn'
import { SatisfiedIcon } from './icons'
import { CopyIcon } from './icons/symbols/CopyIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip/Tooltip'

interface Props {
  toCopy: string
  className?: string
}

export function CopyButton(props: Props) {
  return (
    <div
      data-role="copy-button-wrapper"
      className={cn('group', props.className)}
    >
      <Tooltip className='group-data-[copied="true"]:hidden'>
        <TooltipTrigger>
          <button
            data-role="copy-button"
            className="flex items-center justify-center"
            data-to-copy={props.toCopy}
          >
            <CopyIcon className="size-6 fill-blue-700 hover:fill-blue-600 dark:fill-blue-500 dark:hover:fill-blue-550" />
          </button>
        </TooltipTrigger>
        <TooltipContent prefferedPosition="top">
          <span className="hidden md:inline">Copy URL</span>
          <span className="md:hidden">Copied!</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip className='hidden group-data-[copied="true"]:block'>
        <TooltipTrigger onClickHideDisabled>
          <SatisfiedIcon className="size-6 fill-green-700 dark:fill-green-450" />
        </TooltipTrigger>
        <TooltipContent prefferedPosition="top">Copied!</TooltipContent>
      </Tooltip>
    </div>
  )
}
