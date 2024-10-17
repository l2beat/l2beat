'use client'

import { Loader2, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '~/components/ui/button'
import { useIsServer } from '~/lib/is-server'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isServer = useIsServer()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={className}
    >
      {isServer ? (
        <Loader2 className="size-4 animate-spin" />
      ) : resolvedTheme === 'dark' ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}
