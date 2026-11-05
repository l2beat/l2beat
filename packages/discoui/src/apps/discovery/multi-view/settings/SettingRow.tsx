import type { ReactNode } from 'react'
import { IconUndo } from '../../../../icons/IconUndo'

export function SettingsSection(props: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 font-semibold text-coffee-100 text-sm">
        {props.title}
      </h2>
      <div className="divide-y divide-coffee-700 rounded-md border border-coffee-700 bg-coffee-800/50">
        {props.children}
      </div>
    </section>
  )
}

// `controlId` links the title to a control that takes a label (a switch or
// an input), so clicking the title operates it. Controls that name
// themselves, like a radio group, leave it out.
export function SettingRow(props: {
  title: string
  description: ReactNode
  isDefault: boolean
  onReset: () => void
  controlId?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-4 py-3">
      <div className="min-w-0">
        <div className="flex h-5 items-center gap-1">
          {props.controlId === undefined ? (
            <span className="font-medium text-coffee-100 text-sm">
              {props.title}
            </span>
          ) : (
            <label
              htmlFor={props.controlId}
              className="cursor-pointer font-medium text-coffee-100 text-sm"
            >
              {props.title}
            </label>
          )}
          {!props.isDefault && (
            <ResetButton title={props.title} onClick={props.onReset} />
          )}
        </div>
        <div className="mt-1 text-coffee-300 text-xs leading-4">
          {props.description}
        </div>
      </div>
      <div className="shrink-0">{props.children}</div>
    </div>
  )
}

function ResetButton(props: { title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex size-5 cursor-pointer items-center justify-center rounded-xs text-coffee-400 hover:bg-coffee-700 hover:text-coffee-100 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300"
      aria-label={`Reset ${props.title} to default`}
      title="Reset to default"
      onClick={props.onClick}
    >
      <IconUndo className="size-3.5" />
    </button>
  )
}
