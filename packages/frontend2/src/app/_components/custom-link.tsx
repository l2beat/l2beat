import { type VariantProps, cva } from 'class-variance-authority'
import NextLink from 'next/link'
import React from 'react'

type ElementProps<T extends React.ElementType> = T extends undefined
  ? React.ComponentPropsWithoutRef<typeof NextLink>
  : React.ComponentPropsWithoutRef<T>

type LinkProps<T extends React.ElementType> = ElementProps<T> &
  VariantProps<typeof linkVariants> & {
    children: React.ReactNode
    className?: string
    as?: T
  }

// Make sure this is compatible with markdown.css
const linkVariants = cva(
  'font-medium transition-colors duration-300 ease-out',
  {
    variants: {
      variant: {
        primary: 'text-blue-700 hover:!text-blue-550 dark:text-blue-500',
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

export function CustomLink<T extends React.ElementType>({
  variant,
  underline,
  children,
  className,
  as,
  ...rest
}: LinkProps<T>) {
  const Comp: React.ElementType = as === 'a' ? NextLink : as ?? NextLink

  return (
    <Comp className={linkVariants({ variant, underline, className })} {...rest}>
      {children}
    </Comp>
  )
}
