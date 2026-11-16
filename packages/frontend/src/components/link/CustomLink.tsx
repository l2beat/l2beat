import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import { isExternalUrl } from '~/utils/isExternalUrl'

export type CustomLinkProps = Omit<React.ComponentProps<'a'>, 'href'> &
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
        // Deeper in light: it sits on the red callout fill, where
        // --negative is 3.7:1 and red-800 is 6.4:1.
        danger:
          'text-red-800 hover:text-red-900 dark:text-negative dark:hover:text-red-300',
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
  if (isExternalUrl(rest.href)) {
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
    <a className={linkVariants({ variant, underline, className })} {...rest} />
  )
}
