import { useMemo, useState } from 'react'
import { CopyButton } from '~/components/CopyButton'
import { cn } from '~/utils/cn'
import {
  type BadgeTheme,
  type BadgeVariant,
  cropsBadgeHtml,
  cropsBadgeSnippet,
} from '../badge'

const VARIANTS: { value: BadgeVariant; label: string; hint: string }[] = [
  { value: 'full', label: 'Full', hint: 'Footers, about pages, docs' },
  { value: 'compact', label: 'Compact', hint: 'Navbars and headers' },
  { value: 'mark', label: 'Mark', hint: 'Tight spaces, favicon rows' },
]

const THEMES: { value: BadgeTheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

/**
 * The preview renders the very markup the copy button hands over, so a protocol
 * can never paste something that looks different from what convinced them.
 */
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
          // The panel carries the badge's own background, so a light badge on
          // a dark site (and the reverse) is an obvious mistake here rather
          // than a live one.
          theme === 'dark' ? 'bg-[#0d0e10]' : 'bg-[#f3f5f7]',
        )}
      >
        {/* Our own markup, assembled from literals in badge.ts - and it has
            to be injected rather than rendered as JSX, because the point of the
            preview is that it is byte-for-byte the string the copy button
            hands over. */}
        <div dangerouslySetInnerHTML={{ __html: preview }} />
      </div>

      {/* The copy control gets its own strip rather than floating over the
          code: overlaid, it sat on top of the first line, which is the one
          line a reader most wants to see. */}
      <div className="flex items-center justify-between border-divider border-t bg-surface-secondary px-4 py-2">
        <span className="font-semibold text-secondary text-subtitle-12 uppercase tracking-wider">
          html
        </span>
        <CopyButton
          toCopy={snippet}
          copyText="Copy badge"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-paragraph-13 hover:bg-surface-tertiary"
          iconClassName="size-4"
        />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-paragraph-12 leading-relaxed md:text-paragraph-13">
        {snippet}
      </pre>
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
