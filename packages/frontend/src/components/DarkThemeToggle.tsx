import { useTheme } from 'next-themes'
import { MoonIcon } from '~/icons/Moon'
import { SunIcon } from '~/icons/Sun'
import { cn } from '~/utils/cn'

export interface DarkThemeToggleProps {
  className?: string
}

export function DarkThemeToggle({ className }: DarkThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button
      className={cn('flex gap-4 font-medium', className)}
      title="Change color scheme"
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }}
    >
      <SunIcon
        className="hidden text-xl dark:block"
        aria-label="Toggle light mode"
      />
      <MoonIcon
        className="block text-xl dark:hidden"
        aria-label="Toggle dark mode"
      />
    </button>
  )
}
