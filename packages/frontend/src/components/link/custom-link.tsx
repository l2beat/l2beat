import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import NextLink from 'next/link'
import React from 'react'

export type CustomLinkProps = Omit<
  React.ComponentProps<typeof NextLink>,
  'href'
> &
  VariantProps<typeof linkVariants> & {
    children: React.ReactNode
    href: string
    className?: string
  }

// Make sure this is compatible with markdown.css
export const linkVariants = cva(
  'font-medium transition-colors duration-300 ease-out',
  {
    variants: {
      variant: {
        primary: 'text-link hover:text-blue-550',
        danger: 'text-red-300 hover:text-red-700',
        plain: 'text-primary',
      },
      underline: {
        true: 'underline',
        false: 'no-underline',
      },
    },
    defaultVariants: {
      variant: 'primary',
      underline: true,
    },
  },
)

export function CustomLink({
  variant,
  underline,
  className,
  ...rest
}: CustomLinkProps) {
  const isCustomLink = rest.href.startsWith('http')

  if (isCustomLink) {
    return (
      <a
        target="_blank"
        rel="noreferrer noopener"
        className={linkVariants({ variant, underline, className })}
        {...rest}
      />
    )
  }

  return (
    <NextLink
      className={linkVariants({ variant, underline, className })}
      {...rest}
    />
  )
}
