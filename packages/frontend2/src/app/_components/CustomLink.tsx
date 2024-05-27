import { type VariantProps, cva } from 'class-variance-authority'
import NextLink from 'next/link'
import React from 'react'
import { isOutLink } from '../utils/isOutLink'

type PropsFrom<TComponent> = TComponent extends React.FC<infer Props>
  ? Props
  : never

interface LinkProps
  extends VariantProps<typeof linkVariants>,
    PropsFrom<typeof NextLink> {
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
  const outLink = isOutLink(href)

  return (
    <NextLink
      className={linkVariants({ variant, underline, className })}
      target={outLink ? '_blank' : undefined}
      rel={outLink ? 'noreferrer noopener' : undefined}
      href={href}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
