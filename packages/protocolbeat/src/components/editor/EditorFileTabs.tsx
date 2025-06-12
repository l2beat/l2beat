import clsx from 'clsx'
import { IconCodeFile } from '../../icons/IconCodeFile'

type EditorFileTabsProps = {
  files: EditorFileTabProps[]
}

export function EditorFileTabs(props: EditorFileTabsProps) {
  return (
    <div className="flex flex-shrink-0 flex-grow gap-1 overflow-x-auto border-b border-b-coffee-600 px-1 pt-1">
      {props.files.map((file) => (
        <EditorFileTab key={file.id} {...file} />
      ))}
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
      className={clsx(
        'flex h-6 items-center gap-1 px-2 text-sm',
        props.isActive && 'bg-autumn-300 text-black',
        !props.isActive && 'text-coffee-200 hover:bg-coffee-200/20',
      )}
      title={`${props.name}${props.readOnly ? ' (read-only)' : ''}${props.isDirty ? ' (modified)' : ''}`}
    >
      <IconCodeFile />
      <span className="flex items-center gap-1">
        {props.name}
        {props.isDirty && (
          <span
            className="h-2 w-2 rounded-full bg-aux-orange"
            title="File has unsaved changes"
          />
        )}
        {props.readOnly && (
          <span className="text-xs opacity-60" title="Read-only file">
            🔒
          </span>
        )}
      </span>
    </button>
  )
}
