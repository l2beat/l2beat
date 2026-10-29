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
    <div className="flex shrink-0 border-b border-b-coffee-700 bg-coffee-800">
      <div className="flex min-w-0 grow overflow-x-auto">
        {props.files.map((file) => (
          <EditorFileTab key={file.id} {...file} />
        ))}
      </div>
      {props.actions && (
        <div className="flex shrink-0 items-center gap-1.5 px-2">
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
        'flex h-7 items-center gap-1.5 border-coffee-700 border-t-2 border-r px-2.5 font-medium text-xs',
        props.isActive &&
          'min-w-24 border-t-autumn-300 bg-coffee-900 text-autumn-300',
        !props.isActive &&
          'min-w-16 max-w-[200px] shrink-[100] border-t-transparent text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100',
      )}
      title={`${props.name}${props.readOnly ? ' (read-only)' : ''}${props.isDirty ? ' (modified)' : ''}`}
    >
      <IconCodeFile className="size-3.5 shrink-0" />
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
