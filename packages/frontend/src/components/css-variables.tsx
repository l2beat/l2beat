const THEMES = { light: '', dark: '.dark' } as const

export function CssVariables({
  variables,
}: {
  variables: Record<string, string | { light: string; dark?: string }>
}) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
html${prefix} {
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
`,
          )
          .join('\n'),
      }}
    />
  )
}
