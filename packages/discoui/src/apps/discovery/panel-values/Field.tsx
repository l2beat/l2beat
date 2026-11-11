import { Fragment, useEffect, useRef } from 'react'
import type { Field } from '../../../api/types'
import { cn } from '../../../utils/cn'
import { type ConfigModels, useConfigModels } from '../hooks/useConfigModels'
import { usePanelStore } from '../store/panel-store'
import { FieldValueDisplay, HEX_WORD_LENGTH } from './FieldValueDisplay'
import { FieldConfigDialog } from './field-config-dialog/FieldConfigDialog'
import { PastUpgradesDisplay } from './PastUpgradesDisplay'
import { buildPastUpgradeRows } from './pastUpgrades'

export interface FieldDisplayProps {
  field: Field
  address: string
}

export function FieldDisplay({ field, address }: FieldDisplayProps) {
  const {
    configModel,
    templateModel,
    canModify: canModifyModel,
  } = useConfigModels()

  const ref = useRef<HTMLLIElement>(null)
  const isRevealed = usePanelStore(
    (s) =>
      s.revealedField?.address === address &&
      s.revealedField.name === field.name,
  )
  const revealField = usePanelStore((s) => s.revealField)
  useEffect(() => {
    if (!isRevealed) return
    ref.current?.scrollIntoView({ block: 'start' })
    revealField(undefined)
  }, [isRevealed, revealField])

  const canModify = canModifyField(field) && canModifyModel
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
  const severity = getSeverityAnnotation(field.name, configModel, templateModel)
  const annotations = getAnnotations(field.name, configModel, templateModel)
  const isBlock = isBlockValue(field)

  return (
    <li
      ref={ref}
      className="group/field col-span-full grid grid-cols-subgrid border-coffee-800 border-b text-xs last:border-b-0"
    >
      <div className="sticky top-0 z-10 col-span-full grid @[480px]:grid-cols-subgrid grid-cols-[minmax(0,1fr)_auto] items-start bg-coffee-900 group-hover/field:bg-coffee-800">
        <div className="wrap-anywhere col-start-1 row-start-1 pt-[5px] @[480px]:pr-4 @[480px]:pb-[5px] pl-3 font-medium font-mono text-coffee-200 leading-4">
          {field.name}
        </div>
        {severity && (
          <div className="col-start-2 row-start-1 pt-[5px] @[480px]:pr-4 pr-8">
            <Annotation annotation={severity} isSeverity />
          </div>
        )}
        {annotations.length > 0 && (
          <div className="@[480px]:-mt-[3px] @[480px]:col-span-1 col-span-full @[480px]:col-start-1 row-start-2 flex flex-wrap gap-x-3 @[480px]:pr-4 pr-3 @[480px]:pb-[5px] pl-3">
            {annotations.map((annotation) => (
              <Annotation key={annotation.text} annotation={annotation} />
            ))}
          </div>
        )}
        <div
          className={cn(
            '@[480px]:col-span-1 col-span-full @[480px]:col-start-3 @[480px]:row-span-2 @[480px]:row-start-1 row-start-3',
            'min-h-4 min-w-0 overflow-x-auto @[480px]:py-[5px] pt-0.5 pr-8 pb-[5px] @[480px]:pl-0 pl-6 leading-4',
          )}
        >
          <div
            className={cn(
              // Address rows carry 16px icons that push their text below the name's baseline.
              field.value.type === 'address' && '-my-[3px]',
            )}
          >
            {isBlock && (
              <span className="font-mono text-coffee-400">
                {toBlockSummary(field)}
              </span>
            )}
            {!isBlock && <FieldValueDisplay topLevel value={field.value} />}
          </div>
        </div>
        {canModify && (
          <div className="absolute top-[5px] right-2 flex size-4 items-center justify-center opacity-0 focus-within:opacity-100 group-hover/field:opacity-100">
            <FieldConfigDialog fieldName={field.name} />
          </div>
        )}
      </div>
      {description && (
        <div className="col-span-full whitespace-normal px-3 pb-1 text-coffee-400 leading-[18px]">
          {description}
        </div>
      )}
      {sourcedPermissions.length > 0 && (
        <div className="col-span-full grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-0.5 whitespace-normal px-3 pb-1 leading-[18px]">
          {sourcedPermissions.map(({ permission, source }, i) => (
            <Fragment key={i}>
              <span
                className="whitespace-nowrap font-mono"
                title={`set in the ${source}`}
              >
                <span className="text-aux-teal">{permission.type}</span>
                {permission.role && (
                  <span className="text-coffee-400"> ({permission.role})</span>
                )}
                {source === 'config' && <ConfigMark />}
              </span>
              <span className="text-coffee-300">{permission.description}</span>
            </Fragment>
          ))}
        </div>
      )}
      {isBlock && (
        <div className="col-span-full overflow-x-auto px-3 pb-1.5 contain-paint">
          {field.name === '$pastUpgrades' ? (
            <PastUpgradesDisplay value={field.value} />
          ) : (
            <FieldValueDisplay topLevel value={field.value} />
          )}
        </div>
      )}
    </li>
  )
}

interface FieldAnnotation {
  text: string
  isFromConfig: boolean
  title: string
}

type Models = Pick<ConfigModels, 'configModel' | 'templateModel'>

function getSeverityAnnotation(
  fieldName: string,
  configModel: Models['configModel'],
  templateModel: Models['templateModel'],
): FieldAnnotation | undefined {
  const inConfig = configModel.getFieldSeverity(fieldName)
  const inTemplate = templateModel.getFieldSeverity(fieldName)
  const severity = inConfig ?? inTemplate
  if (severity === undefined) {
    return undefined
  }
  return {
    text: severity,
    isFromConfig: inConfig !== undefined,
    title: toSourceTitle('severity', inConfig, inTemplate),
  }
}

function getAnnotations(
  fieldName: string,
  configModel: Models['configModel'],
  templateModel: Models['templateModel'],
): FieldAnnotation[] {
  const annotations: FieldAnnotation[] = []

  const handlerInConfig = configModel.getFieldHandler(fieldName)?.type
  const handlerInTemplate = templateModel.getFieldHandler(fieldName)?.type
  const handler = handlerInConfig ?? handlerInTemplate
  if (handler !== undefined) {
    annotations.push({
      text: `handler: ${handler}`,
      isFromConfig: handlerInConfig !== undefined,
      title: toSourceTitle('handler', handlerInConfig, handlerInTemplate),
    })
  }

  const flags = [
    {
      key: 'ignoreRelatives',
      inConfig: isListed(configModel.ignoreRelatives, fieldName),
      inTemplate: isListed(templateModel.ignoreRelatives, fieldName),
    },
    {
      key: 'ignoreInWatchMode',
      inConfig: configModel.ignoreInWatchMode?.includes(fieldName),
      inTemplate: templateModel.ignoreInWatchMode?.includes(fieldName),
    },
  ]
  for (const flag of flags) {
    if (flag.inConfig || flag.inTemplate) {
      annotations.push({
        text: flag.key,
        isFromConfig: flag.inConfig === true,
        title: toSourceTitle(
          flag.key,
          flag.inConfig ? 'yes' : undefined,
          flag.inTemplate ? 'yes' : undefined,
        ),
      })
    }
  }
  return annotations
}

function isListed(list: true | string[] | undefined, fieldName: string) {
  return list === true || list?.includes(fieldName)
}

function toSourceTitle(
  key: string,
  inConfig: string | undefined,
  inTemplate: string | undefined,
): string {
  if (inConfig !== undefined && inTemplate !== undefined) {
    return `${key}: ${inConfig} in the config, ${inTemplate} in the template`
  }
  if (inConfig !== undefined) {
    return `${key}: ${inConfig}, set in the config`
  }
  return `${key}: ${inTemplate}, set in the template`
}

function Annotation(props: {
  annotation: FieldAnnotation
  isSeverity?: boolean
}) {
  return (
    <span
      className={cn(
        'whitespace-nowrap font-mono leading-4',
        props.isSeverity
          ? cn(
              'font-semibold text-[10px]',
              toSeverityColor(props.annotation.text),
            )
          : 'text-[11px] text-coffee-400',
      )}
      title={props.annotation.title}
    >
      {props.annotation.text}
      {props.annotation.isFromConfig && <ConfigMark />}
    </span>
  )
}

function ConfigMark() {
  return (
    <span className="select-none align-super font-mono font-semibold text-[9px] text-aux-cyan leading-none">
      C
    </span>
  )
}

function toSeverityColor(severity: string): string {
  if (severity === 'HIGH') {
    return 'text-aux-red'
  }
  if (severity === 'MEDIUM') {
    return 'text-aux-yellow'
  }
  return 'text-coffee-400'
}

function isBlockValue(field: Field): boolean {
  const value = field.value
  if (value.type === 'array' || value.type === 'object') {
    return value.values.length > 0
  }
  return value.type === 'hex' && value.value.length > HEX_WORD_LENGTH
}

function toBlockSummary(field: Field): string {
  const value = field.value
  if (field.name === '$pastUpgrades') {
    return toCountLabel(buildPastUpgradeRows(value).length, 'upgrade')
  }
  if (value.type === 'array') {
    return toCountLabel(value.values.length, 'item')
  }
  if (value.type === 'object') {
    return toCountLabel(value.values.length, 'key')
  }
  if (value.type === 'hex') {
    return toCountLabel((value.value.length - 2) / 2, 'byte')
  }
  throw new Error('Only block values have a summary')
}

function toCountLabel(count: number, noun: string): string {
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`
}

function canModifyField(field: Field) {
  return !field.name.startsWith('$')
}
