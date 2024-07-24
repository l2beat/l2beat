import React, { ReactNode } from 'react'

import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { isOutLink } from '../utils/isOutLink'
import { ArrowRightIcon } from './icons'

export type LinkProps = {
  children: ReactNode
  href?: string
  showArrow?: boolean
  className?: string
  'data-role'?: string
  'data-state'?: string
} & VariantProps<typeof linkVariants>

// Make sure this is compatible with markdown.css
const linkVariants = cva(
  'font-medium transition-colors duration-300 ease-out',
  {
    variants: {
      type: {
        primary:
          'text-blue-700 dark:hover:text-blue-550 dark:text-blue-500 hover:text-blue-550',
        danger: 'text-red-300 hover:text-red-700',
        plain: 'text-black dark:text-white',
      },
      underline: {
        true: 'underline',
        false: 'no-underline',
      },
    },
    defaultVariants: {
      type: 'primary',
      underline: true,
    },
  },
)

export function Link({
  type,
  className,
  children,
  underline = true,
  showArrow,
  ...rest
}: LinkProps) {
  const role = rest['data-role']
  const isEtherscanLink = role === 'etherscan-link'
  return (
    <a
      className={cn(
        'group cursor-pointer font-medium transition-colors',
        isEtherscanLink && etherscanLinkClassnames,
        underline && 'underline',
        linkVariants({ type, underline }),
        className,
      )}
      target={'href' in rest && isOutLink(rest.href) ? '_blank' : undefined}
      rel={
        'href' in rest && isOutLink(rest.href)
          ? 'noreferrer noopener'
          : undefined
      }
      {...rest}
    >
      {children}
      {showArrow && (
        <ArrowRightIcon className="ml-1 inline-block fill-current transition-transform group-hover:translate-x-px" />
      )}
    </a>
  )
}

const etherscanLinkClassnames = cn(
  'data-[state=highlighted]:relative data-[state=highlighted]:z-10',
  'data-[state=highlighted]:before:-left-1 data-[state=highlighted]:before:-top-0.5 data-[state=highlighted]:before:absolute',
  'data-[state=highlighted]:before:-bottom-0.5 data-[state=highlighted]:before:-right-1 data-[state=highlighted]:before:rounded',
  'data-[state=highlighted]:before:-z-10 data-[state=highlighted]:before:border',
  'data-[state=highlighted]:before:border-yellow-700 data-[state=highlighted]:before:border-dashed data-[state=highlighted]:before:bg-yellow-250/50 data-[state=highlighted]:before:content-[""]',
  'data-[state=highlighted]:before:dark:border-yellow-250 data-[state=highlighted]:before:dark:bg-yellow-250/10',
)
