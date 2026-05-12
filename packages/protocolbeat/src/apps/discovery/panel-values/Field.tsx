import { Fragment } from 'react'
import type { Field } from '../../../api/types'
import { cn } from '../../../utils/cn'
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
  const sourcedPermissions = [
    ...(templateModel.getFieldPermissions(field.name) ?? []).map((p) => ({
      permission: p,
      source: 'template' as const,
    })),
    ...(configModel.getFieldPermissions(field.name) ?? []).map((p) => ({
      permission: p,
      source: 'config' as const,
    })),
  ]

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
    {
      tag: `handler:${templateModel.getFieldHandler(field.name)?.type ?? 'NONE'}`,
      isActive: templateModel.getFieldHandler(field.name)?.type,
      onClick: undefined,
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
    {
      tag: `handler:${configModel.getFieldHandler(field.name)?.type ?? 'NONE'}`,
      isActive: configModel.getFieldHandler(field.name)?.type,
      onClick: undefined,
    },
  ] as const

  return (
    <li className="group/field overflow-hidden border-coffee-800 border-b text-sm last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1 text-xs">
        <div className="flex flex-wrap items-center gap-1 font-bold">
          <span>{field.name}</span>
          {templateTags
            .filter((x) => x.isActive)
            .map((x) => (
              <FieldTag
                key={`${field.name}:${x.tag}`}
                source="template"
                onRemoveClick={canModify ? x.onClick : undefined}
              >
                {x.tag}
              </FieldTag>
            ))}
          {configTags
            .filter((x) => x.isActive)
            .map((x) => (
              <FieldTag
                key={`${field.name}:${x.tag}`}
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
      </div>
      {description && (
        <div className="whitespace-normal px-5 pb-1 font-serif text-coffee-200 italic">
          {description}
        </div>
      )}
      {sourcedPermissions.length > 0 && (
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 whitespace-normal px-5 pb-1 text-xs">
          {sourcedPermissions.map(({ permission, source }, i) => (
            <Fragment key={i}>
              <span className="flex items-center gap-1 whitespace-nowrap font-mono">
                <span className="text-coffee-600">▸</span>
                <span className="text-aux-teal">{permission.type}</span>
                {permission.role && (
                  <span className="text-coffee-400">({permission.role})</span>
                )}
                <span
                  className={cn(
                    'inline-block w-3 select-none rounded-sm text-center text-2xs text-coffee-800',
                    source === 'template' ? 'bg-aux-green' : 'bg-aux-cyan',
                  )}
                  title={`from ${source}`}
                >
                  {source === 'template' ? 'T' : 'C'}
                </span>
              </span>
              <span className="text-coffee-200">{permission.description}</span>
            </Fragment>
          ))}
        </div>
      )}
      <div className="overflow-x-auto bg-coffee-900 px-10 py-0.5">
        <FieldValueDisplay topLevel value={field.value} />
      </div>
    </li>
  )
}

function canModifyField(field: Field) {
  return !field.name.startsWith('$')
}
