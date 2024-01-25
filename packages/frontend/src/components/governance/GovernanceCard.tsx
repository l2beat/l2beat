import React, { ComponentPropsWithoutRef } from 'react'

import { cn } from '../../utils/cn'

type GovernanceCardProps<T extends React.ElementType> = {
  children: React.ReactNode
  className?: string
  type?: GovernanceCardType
  as?: T
} & ComponentPropsWithoutRef<T>

type GovernanceCardType = 'primary' | 'purple'

const typeToColor: Record<GovernanceCardType, string> = {
  primary: 'bg-zinc-800',
  purple: 'bg-purple-100',
}

export function GovernanceCard<T extends React.ElementType>({
  children,
  className,
  type = 'primary',
  as,
  ...rest
}: GovernanceCardProps<T>) {
  const Comp = as ?? 'div'
  return (
    <Comp
      className={cn('rounded-lg p-8', typeToColor[type], className)}
      {...rest}
    >
      {children}
    </Comp>
  )
}

interface GovernanceCardHeaderProps {
  title: string
}

export function GovernanceCardHeader({ title }: GovernanceCardHeaderProps) {
  return <h1 className="text-3xl font-bold">{title}</h1>
}
