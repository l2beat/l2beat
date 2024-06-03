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

ExcludeAssociatedTokensWrapper.TokensIncludedView = function IncludedView({
  children,
}: Props) {
  return (
    <div className="group-data-[data-associated-tokens-excluded]:hidden">
      {children}
    </div>
  )
}

ExcludeAssociatedTokensWrapper.TokensExcludedView = function ExcludedView({
  children,
}: Props) {
  return (
    <div className="hidden group-data-[data-associated-tokens-excluded]:inline">
      {children}
    </div>
  )
}
