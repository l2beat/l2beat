import { useEffect, useState } from 'react'

/** Canvas drawing cannot use CSS variables */
export interface ThemeTokens {
  isDark: boolean
  primary: string
  secondary: string
  brand: string
  surface: string
  surfaceSecondary: string
  divider: string
}

const LIGHT_TOKENS: ThemeTokens = {
  isDark: false,
  primary: '#131215',
  secondary: '#5f6470',
  brand: '#9621bf',
  surface: '#fafafa',
  surfaceSecondary: '#e6e7ec',
  divider: '#ccd0da',
}

/** Follows the theme toggle, which swaps a class on the root element */
export function useThemeTokens(): ThemeTokens {
  const [tokens, setTokens] = useState<ThemeTokens>(LIGHT_TOKENS)
  useEffect(() => {
    const root = document.documentElement
    const read = () => {
      const style = getComputedStyle(root)
      const value = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback
      setTokens({
        isDark: root.classList.contains('dark'),
        primary: value('--primary', LIGHT_TOKENS.primary),
        secondary: value('--secondary', LIGHT_TOKENS.secondary),
        brand: value('--brand', LIGHT_TOKENS.brand),
        surface: value('--surface-primary', LIGHT_TOKENS.surface),
        surfaceSecondary: value(
          '--surface-secondary',
          LIGHT_TOKENS.surfaceSecondary,
        ),
        divider: value('--divider', LIGHT_TOKENS.divider),
      })
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return tokens
}
