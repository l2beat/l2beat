import { type VariantProps, cva } from 'class-variance-authority'
import NextLink from 'next/link'
import React from 'react'

export type CustomLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof NextLink>,
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
        primary:
          'text-blue-700 hover:text-blue-550 dark:text-blue-500 dark:hover:text-blue-550',
        danger: 'text-red-300 hover:text-red-700',
        plain: 'text-black dark:text-white',
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
  children,
  className,
  ...rest
}: CustomLinkProps) {
  return (
    <NextLink
      className={linkVariants({ variant, underline, className })}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
