import { useTheme } from '../hooks/useTheme'

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>Switch</button>
}
