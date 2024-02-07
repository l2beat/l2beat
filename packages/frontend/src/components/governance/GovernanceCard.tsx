import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentPropsWithoutRef } from 'react'

import { cn } from '../../utils/cn'

type GovernanceCardProps<T extends React.ElementType> = {
  children: React.ReactNode
  className?: string
  mobileFull?: boolean
  as?: T
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof governanceCardVariants>

const governanceCardVariants = cva('rounded-lg', {
  variants: {
    type: {
      primary: 'bg-gray-100 dark:bg-zinc-900',
      secondary: 'bg-zinc-300 dark:bg-zinc-800',
      purple: 'bg-purple-100 text-white',
    },
    size: {
      default: 'p-8',
      medium: 'p-6',
    },
  },
  defaultVariants: {
    type: 'primary',
    size: 'default',
  },
})

export function GovernanceCard<T extends React.ElementType>({
  children,
  className,
  type,
  size,
  as,
  mobileFull,
  ...rest
}: GovernanceCardProps<T>) {
  const Comp = as ?? 'div'
  return (
    <Comp
      className={cn(
        governanceCardVariants({ type, size }),
        mobileFull &&
          '-mx-4 rounded-none px-4 py-16 md:mx-0 md:rounded-lg md:p-8',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

interface GovernanceCardHeaderProps {
  children: string
}

export function GovernanceCardHeader({ children }: GovernanceCardHeaderProps) {
  return <h1 className="text-2xl font-bold md:text-3xl">{children}</h1>
}
