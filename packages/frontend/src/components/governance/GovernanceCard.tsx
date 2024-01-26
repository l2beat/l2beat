import React, { ComponentPropsWithoutRef } from 'react'

import { cn } from '../../utils/cn'

type GovernanceCardProps<T extends React.ElementType> = {
  children: React.ReactNode
  className?: string
  type?: GovernanceCardType
  mobileFull?: boolean
  as?: T
} & ComponentPropsWithoutRef<T>

type GovernanceCardType = 'primary' | 'purple'

const typeToColor: Record<GovernanceCardType, string> = {
  primary: 'bg-gray-100 dark:bg-zinc-800',
  purple: 'bg-purple-300 dark:bg-purple-100',
}

export function GovernanceCard<T extends React.ElementType>({
  children,
  className,
  type = 'primary',
  as,
  mobileFull,
  ...rest
}: GovernanceCardProps<T>) {
  const Comp = as ?? 'div'
  return (
    <Comp
      className={cn(
        'rounded-lg p-8',
        typeToColor[type],
        mobileFull &&
          '-mx-4 rounded-none py-16 px-4 md:mx-0 md:rounded-lg md:p-8',
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
  return <h1 className="text-3xl font-bold">{children}</h1>
}
