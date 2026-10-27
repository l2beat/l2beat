import { Fragment } from 'react'
import type { Field } from '../../../api/types'
import { cn } from '../../../utils/cn'
import { useConfigModels } from '../hooks/useConfigModels'
import { FieldTag } from './FieldTag'
import { FieldValueDisplay } from './FieldValueDisplay'
import { FieldConfigDialog } from './field-config-dialog/FieldConfigDialog'
import { PastUpgradesDisplay } from './PastUpgradesDisplay'

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
      isActive:
        templateModel.ignoreRelatives === true ||
        templateModel.ignoreRelatives?.includes(field.name),
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
      isActive:
        configModel.ignoreRelatives === true ||
        configModel.ignoreRelatives?.includes(field.name),
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
    <li className="group/field border-coffee-800 border-b text-sm last:border-b-0">
      <div className="sticky top-0 z-10 border-coffee-800 border-b bg-coffee-800">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1 text-xs">
          <div className="flex flex-wrap items-center gap-1 font-semibold text-coffee-100">
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
          </div>
          <div className="opacity-0 group-hover/field:opacity-100">
            {canModify && <FieldConfigDialog fieldName={field.name} />}
          </div>
        </div>
        {description && (
          <div className="whitespace-normal px-3 pb-1 text-[13px] text-coffee-300 leading-[18px]">
            {description}
          </div>
        )}
      </div>
      {sourcedPermissions.length > 0 && (
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 whitespace-normal px-3 pb-1 text-xs">
          {sourcedPermissions.map(({ permission, source }, i) => (
            <Fragment key={i}>
              <span className="flex items-center gap-1 whitespace-nowrap font-mono">
                <span className="text-coffee-400">▸</span>
                <span className="text-aux-teal">{permission.type}</span>
                {permission.role && (
                  <span className="text-coffee-400">({permission.role})</span>
                )}
                <span
                  className={cn(
                    'inline-block w-3.5 select-none rounded-xs py-0.5 text-center font-mono font-semibold text-[11px] text-coffee-100 leading-3',
                    source === 'template'
                      ? 'bg-aux-green/25'
                      : 'bg-aux-cyan/25',
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
      <div className="overflow-x-auto bg-coffee-900 px-3 py-1 contain-paint">
        {field.name === '$pastUpgrades' ? (
          <PastUpgradesDisplay value={field.value} />
        ) : (
          <FieldValueDisplay topLevel value={field.value} />
        )}
      </div>
    </li>
  )
}

function canModifyField(field: Field) {
  return !field.name.startsWith('$')
}
