import type { Field } from '../../../api/types'
import { useConfigModels } from '../hooks/useConfigModels'
import { FieldTag } from './FieldTag'
import { FieldValueDisplay } from './FieldValueDisplay'
import { FieldConfigDialog } from './field-config-dialog/FieldConfigDialog'

export interface FieldDisplayProps {
  field: Field
}

export function FieldDisplay({ field }: FieldDisplayProps) {
  const {
    configModel,
    templateModel,
    canModify: canModifyModel,
  } = useConfigModels()

  const canModify = canModifyField(field) && canModifyModel
  const canModifyTemplate = canModify && templateModel.hasTemplate
  const description =
    configModel.getFieldDescription(field.name) ??
    templateModel.getFieldDescription(field.name)

  const templateTags = [
    {
      tag: 'ignore:method',
      isActive: templateModel.ignoreMethods?.includes(field.name),
      onClick: canModifyTemplate
        ? () => templateModel.toggleIgnoreMethods(field.name)
        : undefined,
    },
    {
      tag: 'ignore:relative',
      isActive: templateModel.ignoreRelatives?.includes(field.name),
      onClick: canModifyTemplate
        ? () => templateModel.toggleIgnoreRelatives(field.name)
        : undefined,
    },
    {
      tag: 'ignore:watch-mode',
      isActive: templateModel.ignoreInWatchMode?.includes(field.name),
      onClick: canModifyTemplate
        ? () => templateModel.toggleIgnoreInWatchMode(field.name)
        : undefined,
    },
    {
      tag: `severity:${templateModel.getFieldSeverity(field.name) ?? 'NONE'}`,
      isActive: templateModel.getFieldSeverity(field.name) !== undefined,
      onClick: canModifyTemplate
        ? () => templateModel.setFieldSeverity(field.name, undefined)
        : undefined,
    },
  ]

  const configTags = [
    {
      tag: 'ignore:method',
      isActive: configModel.ignoreMethods?.includes(field.name),
      onClick: canModify
        ? () => configModel.toggleIgnoreMethods(field.name)
        : undefined,
    },
    {
      tag: 'ignore:relative',
      isActive: configModel.ignoreRelatives?.includes(field.name),
      onClick: canModify
        ? () => configModel.toggleIgnoreRelatives(field.name)
        : undefined,
    },
    {
      tag: 'ignore:watch-mode',
      isActive: configModel.ignoreInWatchMode?.includes(field.name),
      onClick: canModify
        ? () => configModel.toggleIgnoreInWatchMode(field.name)
        : undefined,
    },
    {
      tag: `severity:${configModel.getFieldSeverity(field.name) ?? 'NONE'}`,
      isActive: configModel.getFieldSeverity(field.name) !== undefined,
      onClick: canModify
        ? () => configModel.setFieldSeverity(field.name, undefined)
        : undefined,
    },
  ] as const

  const legacyTags = getLegacyTags(field)
  return (
    <li className="group/field truncate text-sm">
      <div className="flex h-fit flex-wrap items-center gap-2 px-4 py-1 font-bold text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {field.name}
          {legacyTags.map((x, i) => (
            <FieldTag key={i} source="legacy">
              {x}
            </FieldTag>
          ))}
        </div>
        {templateTags
          .filter((x) => x.isActive)
          .map((x, i) => (
            <FieldTag
              key={i}
              source="template"
              onRemoveClick={canModify ? x.onClick : undefined}
            >
              {x.tag}
            </FieldTag>
          ))}

        {configTags
          .filter((x) => x.isActive)
          .map((x, i) => (
            <FieldTag
              key={i}
              source="config"
              onRemoveClick={canModify ? x.onClick : undefined}
            >
              {x.tag}
            </FieldTag>
          ))}
        <div className="opacity-0 group-hover/field:opacity-100">
          {canModify && <FieldConfigDialog field={field} />}
        </div>
      </div>
      {description && (
        <div className="-mt-0.5 px-5 pb-1 font-serif italic">{description}</div>
      )}
      <div className="overflow-x-auto bg-coffee-900 px-10 py-0.5">
        <FieldValueDisplay topLevel value={field.value} />
      </div>
    </li>
  )
}

function getLegacyTags(field: Field) {
  const tags: string[] = []
  if (field.handler) {
    tags.push(`handler:${field.handler.type}`)
  }

  return tags
}

function canModifyField(field: Field) {
  return !field.name.startsWith('$')
}
