import { type VariantProps, cva } from 'class-variance-authority'
import NextLink from 'next/link'
import React, { type ComponentProps } from 'react'

interface LinkProps
  extends VariantProps<typeof linkVariants>,
    ComponentProps<typeof NextLink> {
  href: string
}

// Make sure this is compatible with markdown.css
const linkVariants = cva('font-medium', {
  variants: {
    variant: {
      primary: 'text-blue-700 hover:!text-blue-500 dark:text-blue-400',
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
})

export function CustomLink({
  variant,
  underline,
  href,
  children,
  className,
  ...rest
}: LinkProps) {
  return (
    <NextLink
      className={linkVariants({ variant, underline, className })}
      href={href}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
