import { useId } from 'react'

const THEMES = { light: '', dark: '.dark' } as const

export function CssVariables({
  variables,
  children,
}: {
  variables: Record<string, string | { light: string; dark?: string }>
  children?: React.ReactNode
}) {
  const uniqueId = useId()
  const isLocalScope = !!children

  const styleElement = (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const selector = isLocalScope
              ? `[data-css-vars="${uniqueId}"]${prefix}`
              : `html${prefix}`

            return `
  ${selector} {
  ${Object.entries(variables)
    .map(([key, itemConfig]) => {
      const color =
        typeof itemConfig === 'string' && theme === 'light'
          ? itemConfig
          : itemConfig[theme as keyof typeof itemConfig]
      return color ? `  --${key}: ${color};` : null
    })
    .join('\n')}
  }
  `
          })
          .join('\n'),
      }}
    />
  )

  if (!isLocalScope) {
    return styleElement
  }

  return (
    <div data-css-vars={uniqueId}>
      {styleElement}
      {children}
    </div>
  )
}
