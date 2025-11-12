import { cva } from 'class-variance-authority'
import type { Field } from '../../../api/types'
import { useProjectConfigModels } from '../hooks/useProjectConfig'
import { FieldValueDisplay } from './FieldValueDisplay'

export interface FieldDisplayProps {
  field: Field
}

export function FieldDisplay({ field }: FieldDisplayProps) {
  const { configModel, templateModel, canModify } = useProjectConfigModels()

  const templateTags = [
    {
      tag: 'T:ignore:methods',
      isIgnored: templateModel.ignoreMethods?.includes(field.name),
      onClick: () => {
        if (templateModel.ignoreMethods?.includes(field.name)) {
          templateModel.setIgnoreMethods(
            templateModel.ignoreMethods.filter((x) => x !== field.name),
          )
        } else {
          templateModel.setIgnoreMethods([
            ...(templateModel.ignoreMethods ?? []),
            field.name,
          ])
        }
      },
    },
    {
      tag: 'T:ignore:relatives',
      isIgnored: templateModel.ignoreRelatives?.includes(field.name),
      onClick: () => {
        if (templateModel.ignoreRelatives?.includes(field.name)) {
          templateModel.setIgnoreRelatives(
            templateModel.ignoreRelatives.filter((x) => x !== field.name),
          )
        } else {
          templateModel.setIgnoreRelatives([
            ...(templateModel.ignoreRelatives ?? []),
            field.name,
          ])
        }
      },
    },
    {
      tag: 'T:ignore:watchmode',
      isIgnored: templateModel.ignoreInWatchMode?.includes(field.name),
      onClick: () => {
        if (templateModel.ignoreInWatchMode?.includes(field.name)) {
          templateModel.setIgnoreInWatchMode(
            templateModel.ignoreInWatchMode.filter((x) => x !== field.name),
          )
        } else {
          templateModel.setIgnoreInWatchMode([
            ...(templateModel.ignoreInWatchMode ?? []),
            field.name,
          ])
        }
      },
    },
  ] as const

  const configTags = [
    {
      tag: 'C:ignore:methods',
      isIgnored: configModel.ignoreMethods?.includes(field.name),
      onClick: () => {
        if (configModel.ignoreMethods?.includes(field.name)) {
          configModel.setIgnoreMethods(
            configModel.ignoreMethods.filter((x) => x !== field.name),
          )
        } else {
          configModel.setIgnoreMethods([
            ...(configModel.ignoreMethods ?? []),
            field.name,
          ])
        }
      },
    },
    {
      tag: 'C:ignore:relatives',
      isIgnored: configModel.ignoreRelatives?.includes(field.name),
      onClick: () => {
        if (configModel.ignoreRelatives?.includes(field.name)) {
          configModel.setIgnoreRelatives(
            configModel.ignoreRelatives.filter((x) => x !== field.name),
          )
        } else {
          configModel.setIgnoreRelatives([
            ...(configModel.ignoreRelatives ?? []),
            field.name,
          ])
        }
      },
    },
    {
      tag: 'C:ignore:watchmode',
      isIgnored: configModel.ignoreInWatchMode?.includes(field.name),
      onClick: () => {
        console.log(
          'configModel.ignoreInWatchMode',
          configModel.ignoreInWatchMode,
        )
        if (configModel.ignoreInWatchMode?.includes(field.name)) {
          configModel.setIgnoreInWatchMode(
            configModel.ignoreInWatchMode.filter((x) => x !== field.name),
          )
        } else {
          configModel.setIgnoreInWatchMode([
            ...(configModel.ignoreInWatchMode ?? []),
            field.name,
          ])
        }
      },
    },
  ] as const

  const tags = getFieldTags(field)
  return (
    <li className="mb-1 truncate text-sm last:mb-0">
      <div className="flex flex-wrap gap-2 px-5 py-1 font-bold text-xs">
        {field.name}
        {tags.map((x, i) => (
          <span
            className="bg-aux-blue px-1 text-[10px] text-black uppercase"
            key={i}
          >
            {x}
          </span>
        ))}
        {canModify &&
          templateTags.map((x, i) => (
            <FieldTag
              key={i}
              tag={x.tag}
              onClick={x.onClick}
              state={x.isIgnored ? 'ignored' : 'active'}
            />
          ))}
        {canModify &&
          configTags.map((x, i) => (
            <FieldTag
              key={i}
              tag={x.tag}
              onClick={x.onClick}
              state={x.isIgnored ? 'ignored' : 'active'}
            />
          ))}
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
  state: 'ignored' | 'active'
}

const fieldTagVariants = cva(
  'cursor-pointer text-[10px] text-black uppercase',
  {
    variants: {
      state: {
        ignored: 'bg-aux-blue',
        active: 'bg-coffee-400/40',
      },
    },
    defaultVariants: {
      state: 'active',
    },
  },
)

function FieldTag({ tag, onClick, state }: FieldTagProps) {
  return (
    <span className={fieldTagVariants({ state })} onClick={onClick}>
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
