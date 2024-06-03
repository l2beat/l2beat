import React from 'react'

interface Props {
  children: React.ReactNode
}

export function ExcludeAssociatedTokensWrapper({ children }: Props) {
  return (
    <div className="group" data-role="exclude-associated-tokens-wrapper">
      {children}
    </div>
  )
}

ExcludeAssociatedTokensWrapper.Included = function Included({
  children,
}: Props) {
  return (
    <div className="group-data-[associated-tokens-excluded]:hidden">
      {children}
    </div>
  )
}

ExcludeAssociatedTokensWrapper.Excluded = function Excluded({
  children,
}: Props) {
  return (
    <div className="hidden group-data-[associated-tokens-excluded]:inline">
      {children}
    </div>
  )
}
