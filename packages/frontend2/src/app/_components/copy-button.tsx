'use client'

import React, { useEffect, useState } from 'react'

import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import CopyIcon from '~/icons/copy.svg'
import SatisfiedIcon from '~/icons/satisfied.svg'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

interface Props {
  toCopy: string
  className?: string
}

export function CopyButton(props: Props) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  function copyToClipboard() {
    copy(props.toCopy)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
    setCopied(true)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild onClick={(event) => event.preventDefault()}>
        <button
          className="group flex items-center justify-center"
          data-to-copy={props.toCopy}
          onClick={() => copyToClipboard()}
        >
          {copied ? (
            <SatisfiedIcon className="size-6 animate-in fill-green-700 dark:fill-green-450" />
          ) : (
            <CopyIcon className="size-6 animate-in fill-blue-700 hover:fill-blue-600 dark:fill-blue-500 dark:hover:fill-blue-550" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent onPointerDownOutside={(event) => event.preventDefault()}>
        {copied ? 'Copied!' : 'Copy URL'}
      </TooltipContent>
    </Tooltip>
  )
}
