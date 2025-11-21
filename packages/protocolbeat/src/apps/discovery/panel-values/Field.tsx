import clsx from 'clsx'
import type { Field } from '../../../api/types'
import { useConfigModels } from '../hooks/useConfigModels'
import { FieldValueDisplay } from './FieldValueDisplay'

export interface FieldDisplayProps {
  field: Field
}

export function FieldDisplay({ field }: FieldDisplayProps) {
  const {
    configModel,
    templateModel,
    canModify: canModifyModel,
  } = useConfigModels()

  const templateTags = [
    {
      tag: 'M',
      isIgnored: templateModel.ignoreMethods?.includes(field.name),
      onClick: () => templateModel.toggleIgnoreMethods(field.name),
    },
    {
      tag: 'R',
      isIgnored: templateModel.ignoreRelatives?.includes(field.name),
      onClick: () => templateModel.toggleIgnoreRelatives(field.name),
    },
    {
      tag: 'WM',
      isIgnored: templateModel.ignoreInWatchMode?.includes(field.name),
      onClick: () => templateModel.toggleIgnoreInWatchMode(field.name),
    },
  ] as const

  const configTags = [
    {
      tag: 'M',
      isIgnored: configModel.ignoreMethods?.includes(field.name),
      onClick: () => configModel.toggleIgnoreMethods(field.name),
    },
    {
      tag: 'R',
      isIgnored: configModel.ignoreRelatives?.includes(field.name),
      onClick: () => configModel.toggleIgnoreRelatives(field.name),
    },
    {
      tag: 'WM',
      isIgnored: configModel.ignoreInWatchMode?.includes(field.name),
      onClick: () => configModel.toggleIgnoreInWatchMode(field.name),
    },
  ] as const

  const canModify = canModifyField(field) && canModifyModel

  const tags = getFieldTags(field)
  return (
    <li className="group/field truncate text-sm">
      <div className="flex h-fit flex-wrap items-center justify-between px-4 py-1 font-bold text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {field.name}
          {tags.map((x, i) => (
            <span
              className="bg-aux-blue px-1 py-1 text-[10px] text-black uppercase"
              key={i}
            >
              {x}
            </span>
          ))}
        </div>
        <div className="flex gap-1 opacity-0 group-hover/field:opacity-100">
          {canModify && templateModel.hasTemplate && (
            <BadgeWrapper text="Template">
              {templateTags.map((x, i) => (
                <FieldTag
                  key={i}
                  tag={x.tag}
                  onClick={x.onClick}
                  state={x.isIgnored ? 'enabled' : 'disabled'}
                />
              ))}
            </BadgeWrapper>
          )}
          {canModify && (
            <BadgeWrapper text="Config">
              {configTags.map((x, i) => (
                <FieldTag
                  key={i}
                  tag={x.tag}
                  onClick={x.onClick}
                  state={x.isIgnored ? 'enabled' : 'disabled'}
                />
              ))}
            </BadgeWrapper>
          )}
        </div>
      </div>
      {field.description && (
        <div className="-mt-0.5 px-5 pb-1 font-serif italic">
          {field.description}
        </div>
      )}
      <div className="overflow-x-auto bg-coffee-900 px-10 py-0.5">
        <FieldValueDisplay topLevel value={field.value} />
      </div>
    </li>
  )
}

type FieldTagProps = {
  tag: string
  onClick: () => void
  state: 'enabled' | 'disabled'
}

function FieldTag({ tag, onClick, state }: FieldTagProps) {
  return (
    <span
      className={clsx(
        'cursor-pointer p-0.5 text-[10px] text-black uppercase',
        state === 'enabled' ? 'bg-aux-blue' : 'bg-coffee-400/40',
      )}
      onClick={onClick}
    >
      {tag}
    </span>
  )
}

function getFieldTags(field: Field) {
  const tags: string[] = []
  if (field.handler) {
    tags.push(`handler:${field.handler.type}`)
  }
  if (field.ignoreInWatchMode) {
    tags.push('ignore:watchmode')
  }
  if (field.ignoreRelatives) {
    tags.push('ignore:relatives')
  }
  if (field.severity) {
    tags.push(`severity:${field.severity.toLowerCase()}`)
  }
  return tags
}

function BadgeWrapper(props: {
  text: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className="flex max-w-fit items-center justify-center gap-1 border border-coffee-400/40 px-1 py-0.5 text-coffee-400">
      <span className="select-none">{props.text}</span>
      {props.children}
    </span>
  )
}

function canModifyField(field: Field) {
  return !field.name.startsWith('$') && !field.handler
}
