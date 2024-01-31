import React, { ComponentPropsWithoutRef } from 'react'

import { cn } from '../utils/cn'

type Props<T extends React.ElementType> = {
  children: React.ReactNode
  as?: T
  className?: string
} & ComponentPropsWithoutRef<T>

export function Button<T extends React.ElementType>({
  children,
  as,
  className,
  ...rest
}: Props<T>) {
  const Comp = as ?? 'div'

  return (
    <Comp
      className={cn(
        'cursor-pointer rounded-md border border-pink-900 px-6 py-2 text-center text-xs font-bold hover:bg-pink-900/25',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}
