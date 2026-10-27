import type { ReactNode } from 'react'
import { IconCodeFile } from '../../../icons/IconCodeFile'
import { IconLock } from '../../../icons/IconLock'
import { cn } from '../../../utils/cn'

type EditorFileTabsProps = {
  files: EditorFileTabProps[]
  actions?: ReactNode
}

export function EditorFileTabs(props: EditorFileTabsProps) {
  return (
    <div className="flex shrink-0 border-b border-b-coffee-600">
      <div className="flex min-w-0 grow gap-1 overflow-x-auto px-1 pt-1">
        {props.files.map((file) => (
          <EditorFileTab key={file.id} {...file} />
        ))}
      </div>
      {props.actions && (
        <div className="flex shrink-0 items-center gap-2 px-3">
          {props.actions}
        </div>
      )}
    </div>
  )
}

type EditorFileTabProps = {
  id: string
  name: string
  isDirty?: boolean
  readOnly?: boolean
  isActive?: boolean
  onClick?: () => void
}

function EditorFileTab(props: EditorFileTabProps) {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        'flex h-6 items-center gap-1 px-2 text-sm',
        props.isActive && 'min-w-24 bg-autumn-300 text-black',
        !props.isActive &&
          'min-w-16 max-w-[200px] shrink-[100] text-coffee-200 hover:bg-coffee-200/20',
      )}
      title={`${props.name}${props.readOnly ? ' (read-only)' : ''}${props.isDirty ? ' (modified)' : ''}`}
    >
      <IconCodeFile className="shrink-0" />
      <span className="flex min-w-0 items-center gap-1">
        <span className="min-w-0 truncate">{props.name}</span>
        {props.isDirty && (
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-aux-orange"
            title="File has unsaved changes"
          />
        )}
        {props.readOnly && (
          <span className="shrink-0" title="Read-only file">
            <IconLock className="size-3 shrink-0 opacity-60" />
          </span>
        )}
      </span>
    </button>
  )
}
