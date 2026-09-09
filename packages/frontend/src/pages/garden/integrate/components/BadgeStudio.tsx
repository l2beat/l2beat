import { useMemo, useState } from 'react'
import { cn } from '~/utils/cn'
import {
  type BadgeTheme,
  type BadgeVariant,
  cropsBadgeHtml,
  cropsBadgeSnippet,
} from '../badge'
import { CodeSnippet } from './CodeSnippet'

const VARIANTS: { value: BadgeVariant; label: string; hint: string }[] = [
  { value: 'full', label: 'Full', hint: 'Footers, about pages, docs' },
  { value: 'compact', label: 'Compact', hint: 'Navbars and headers' },
  { value: 'mark', label: 'Mark', hint: 'Tight spaces, favicon rows' },
]

const THEMES: { value: BadgeTheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

/** The preview renders the very markup the copy button hands over. */
export function BadgeStudio({ href }: { href: string }) {
  const [variant, setVariant] = useState<BadgeVariant>('full')
  const [theme, setTheme] = useState<BadgeTheme>('light')

  const options = useMemo(
    () => ({ variant, theme, href }),
    [variant, theme, href],
  )
  const preview = useMemo(() => cropsBadgeHtml(options), [options])
  const snippet = useMemo(() => cropsBadgeSnippet(options), [options])

  return (
    <div className="overflow-hidden rounded-xl border border-divider">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-divider border-b bg-surface-secondary px-4 py-3">
        <Switcher
          label="Size"
          options={VARIANTS.map((x) => ({ value: x.value, label: x.label }))}
          value={variant}
          onChange={setVariant}
        />
        <Switcher
          label="Theme"
          options={THEMES}
          value={theme}
          onChange={setTheme}
        />
        <span className="ml-auto text-paragraph-13 text-secondary max-md:hidden">
          {VARIANTS.find((x) => x.value === variant)?.hint}
        </span>
      </div>

      <div
        className={cn(
          'flex min-h-[140px] items-center justify-center p-6',
          theme === 'dark' ? 'bg-[#0d0e10]' : 'bg-[#f3f5f7]',
        )}
      >
        {/* Our own literals from badge.ts, injected so the preview is byte-for-byte the copied string. */}
        <div dangerouslySetInnerHTML={{ __html: preview }} />
      </div>

      <CodeSnippet
        className="rounded-none border-0 border-divider border-t"
        language="html"
        code={snippet}
        label="html"
        copy={snippet}
        copyText="Copy badge"
      />
    </div>
  )
}

function Switcher<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-secondary text-subtitle-12 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex rounded-lg bg-surface-tertiary p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium text-paragraph-13 transition-colors',
              option.value === value
                ? 'bg-surface-primary text-primary shadow-sm'
                : 'text-secondary hover:text-primary',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
