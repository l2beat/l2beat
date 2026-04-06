import { clsx } from 'clsx'

export type ViewMode = 'report' | 'explorer' | 'activity'

interface ViewModeToggleProps {
  current: ViewMode
  onChange: (mode: ViewMode) => void
  children?: React.ReactNode
}

const modes: { value: ViewMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'report',
    label: 'Report',
    description: 'Narrative review with explanations',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    value: 'explorer',
    label: 'Explorer',
    description: 'Detailed data tables and diagrams',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: 'activity',
    label: 'Activity',
    description: 'Timeline of protocol changes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function ViewModeToggle({ current, onChange, children }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-bg-muted rounded-xl border border-border">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          title={mode.description}
          className={clsx(
            'flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all',
            current === mode.value
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-text-secondary hover:text-purple-600',
          )}
        >
          {mode.icon}
          <span className="hidden sm:inline">{mode.label}</span>
        </button>
      ))}
      {children && (
        <>
          <div className="w-px h-6 bg-border mx-0.5" />
          {children}
        </>
      )}
    </div>
  )
}
