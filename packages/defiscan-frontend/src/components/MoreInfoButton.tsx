import { useEffect, useRef, useState } from 'react'
import type { CompiledResourceEntry, CompiledResourceType } from '../types'

interface MoreInfoButtonProps {
  resources: CompiledResourceEntry[]
}

const DROPDOWN_TYPES: CompiledResourceType[] = [
  'website',
  'docs',
  'github',
  'source-code',
  'x',
  'defiscan-v1',
  'other',
]

const TYPE_ORDER: Record<CompiledResourceType, number> = {
  website: 0,
  docs: 1,
  github: 2,
  'source-code': 3,
  x: 4,
  'defiscan-v1': 5,
  other: 6,
  frontend: 99,
  license: 99,
}

const DEFAULT_LABELS: Record<CompiledResourceType, string> = {
  website: 'Website',
  docs: 'Documentation',
  github: 'GitHub',
  'source-code': 'Source Code',
  x: 'X (Twitter)',
  'defiscan-v1': 'DeFiScan V1',
  other: 'Link',
  frontend: 'Frontend',
  license: 'License',
}

function shortenUrl(url: string) {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function iconFor(type: CompiledResourceType) {
  switch (type) {
    case 'github':
      return GitHubIcon
    case 'x':
      return XIcon
    case 'docs':
      return DocsIcon
    case 'source-code':
      return CodeIcon
    case 'website':
    case 'defiscan-v1':
    case 'other':
    default:
      return GlobeIcon
  }
}

export function MoreInfoButton({ resources }: MoreInfoButtonProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const relevant = resources
    .filter((r) => DROPDOWN_TYPES.includes(r.type))
    .sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside)
      return () => document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  if (relevant.length === 0) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white text-text-primary border border-border px-4 sm:px-6 py-3 sm:py-[13px] rounded-sm font-semibold text-sm sm:text-base hover:bg-slate-50 transition-colors"
      >
        More Info
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg border border-border bg-white shadow-lg">
          {relevant.map((r, i) => {
            const Icon = iconFor(r.type)
            const label =
              r.label ??
              (r.type === 'other' ? shortenUrl(r.url) : DEFAULT_LABELS[r.type])
            const isFirst = i === 0
            const isLast = i === relevant.length - 1
            const rounded = isFirst
              ? 'rounded-t-lg'
              : isLast
                ? 'rounded-b-lg'
                : ''
            return (
              <a
                key={`${r.type}-${r.url}-${i}`}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50 ${rounded}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DocsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
