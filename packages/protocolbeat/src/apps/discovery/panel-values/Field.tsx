import type { Field } from '../../../api/types'
import { useConfig } from '../../../hooks/useConfigPortal'
import { FieldValueDisplay } from './FieldValueDisplay'

export interface FieldDisplayProps {
  field: Field
}

export function FieldDisplay({ field }: FieldDisplayProps) {
  const _ = getFieldTags(field)
  const config = useConfig()
  const ignoreInWatchMode = config.getIgnoreInWatchMode().includes(field.name)
  const ignoreRelatives = config.getIgnoreRelatives().includes(field.name)
  const ignoreMethods = config.getIgnoreMethods().includes(field.name)
  const ignoreDiscovery = config.getIgnoreDiscovery()

  const tagsV2 = [
    ignoreInWatchMode
      ? {
          label: 'ignore:watchmode:yes',
          onClick: () => config.setIgnoreInWatchMode([]),
        }
      : undefined,
    ignoreRelatives
      ? {
          label: 'ignore:relatives:yes',
          onClick: () => config.setIgnoreRelatives([]),
        }
      : undefined,
    ignoreMethods
      ? {
          label: 'ignore:methods:yes',
          onClick: () => config.setIgnoreMethods([]),
        }
      : undefined,
    ignoreDiscovery
      ? {
          label: 'ignore:discovery:yes',
          onClick: () => config.setIgnoreDiscovery(false),
        }
      : undefined,
  ].flatMap((x) => (x ? [x] : []))

  return (
    <li className="mb-1 truncate text-sm last:mb-0">
      <div className="flex flex-wrap gap-2 px-5 py-1 font-bold text-xs">
        {field.name}
        {tagsV2.map((x, i) => (
          <span
            className="bg-aux-blue px-1 text-[10px] text-black uppercase"
            key={i}
            onClick={x.onClick}
          >
            {x.label}
          </span>
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
