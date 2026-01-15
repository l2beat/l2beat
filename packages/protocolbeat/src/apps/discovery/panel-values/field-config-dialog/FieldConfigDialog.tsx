import clsx from 'clsx'
import { useMemo, useState } from 'react'
import type { Field } from '../../../../api/types'
import { Button } from '../../../../components/Button'
import { Checkbox } from '../../../../components/Checkbox'
import { Code } from '../../../../components/Code'
import { Dialog } from '../../../../components/Dialog'
import { Kbd } from '../../../../components/Kbd'
import { Tabs } from '../../../../components/Tabs'
import { IconGear } from '../../../../icons/IconGear'
import { useConfigModels } from '../../hooks/useConfigModels'
import { ConfigRow } from '../contract-config-dialog/ContractConfigDialog'
import { DescriptionEditor } from '../contract-config-dialog/DescriptionEditor'
import { FieldHandlerConfigDialog } from './handler-dialog/FieldHandlerConfigDialog'

type Props = {
  field: Field
}

export function FieldConfigDialog(props: Props) {
  const models = useConfigModels()

  const fieldName = props.field.name
  const hasTemplate = models.templateModel.hasTemplate
  const defaultTab = useMemo(() => {
    if (hasTemplate && !models.isPending) {
      return 'template' as const
    }
    return 'config' as const
  }, [hasTemplate, models.isPending])
  const [activeTab, setActiveTab] = useState<'config' | 'template'>(defaultTab)
  const [isOpen, setIsOpen] = useState(false)

  const configSeverity = models.configModel.getFieldSeverity(fieldName)
  const templateSeverity = models.templateModel.getFieldSeverity(fieldName)

  const configDescription = models.configModel.getFieldDescription(fieldName)
  const templateDescription =
    models.templateModel.getFieldDescription(fieldName)

  const configIgnoreMethods =
    models.configModel.ignoreMethods?.includes(fieldName)
  const configIgnoreRelatives =
    models.configModel.ignoreRelatives?.includes(fieldName)
  const configIgnoreInWatchMode =
    models.configModel.ignoreInWatchMode?.includes(fieldName)

  const templateIgnoreMethods =
    models.templateModel.ignoreMethods?.includes(fieldName)
  const templateIgnoreRelatives =
    models.templateModel.ignoreRelatives?.includes(fieldName)
  const templateIgnoreInWatchMode =
    models.templateModel.ignoreInWatchMode?.includes(fieldName)

  const configHandlerString =
    models.configModel.getFieldHandlerString(fieldName)
  const templateHandlerString =
    models.templateModel.getFieldHandlerString(fieldName)

  const activeModel =
    activeTab === 'template' ? models.templateModel : models.configModel

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          setActiveTab(defaultTab)
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="icon" size="icon">
          <IconGear className="size-4 text-coffee-200/80" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Body
        className="flex flex-col overflow-hidden"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            return
          }

          const key = event.key.toLowerCase()

          if (activeTab === 'template' && !hasTemplate) {
            return
          }

          if (key === HOTKEYS.ignoreMethods) {
            activeModel.toggleIgnoreMethods(fieldName)
            event.preventDefault()
            return
          }
          if (key === HOTKEYS.ignoreRelatives) {
            activeModel.toggleIgnoreRelatives(fieldName)
            event.preventDefault()
            return
          }
          if (key === HOTKEYS.ignoreInWatchMode) {
            activeModel.toggleIgnoreInWatchMode(fieldName)
            event.preventDefault()
            return
          }
          if (key === HOTKEYS.configTab) {
            setActiveTab('config')
            event.preventDefault()
            return
          }
          if (key === HOTKEYS.templateTab && hasTemplate) {
            setActiveTab('template')
            event.preventDefault()
            return
          }
          if (key === HOTKEYS.severity) {
            const currentSeverity =
              activeTab === 'template' ? templateSeverity : configSeverity
            const nextSeverity = getNextSeverity(currentSeverity)
            activeModel.setFieldSeverity(fieldName, nextSeverity)
            event.preventDefault()
          }
        }}
      >
        <Dialog.Title>
          Field - <span className="font-mono text-coffee-400">{fieldName}</span>
        </Dialog.Title>
        <Tabs.Root
          className="flex min-h-0 flex-1 flex-col"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as 'config' | 'template')
          }
        >
          <Tabs.List>
            <Tabs.Trigger value="config">
              <span className="flex items-center gap-1">
                Config
                <HotkeyHint label="C" />
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger value="template">
              <span className="flex items-center gap-1">
                Template
                <HotkeyHint label="T" />
              </span>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="config" className="overflow-y-auto py-2">
            <div className="space-y-2">
              <ConfigRow
                headline={
                  <span className="flex items-center gap-2">
                    Severity
                    <HotkeyHint label="S" />
                  </span>
                }
              >
                <div className="flex gap-2">
                  <SeverityButton
                    onClick={() =>
                      models.configModel.setFieldSeverity(fieldName, 'HIGH')
                    }
                    isActive={configSeverity === 'HIGH'}
                  >
                    HIGH
                  </SeverityButton>
                  <SeverityButton
                    onClick={() =>
                      models.configModel.setFieldSeverity(fieldName, 'LOW')
                    }
                    isActive={configSeverity === 'LOW'}
                  >
                    LOW
                  </SeverityButton>
                  <SeverityButton
                    isActive={configSeverity === undefined}
                    onClick={() =>
                      models.configModel.setFieldSeverity(fieldName, undefined)
                    }
                  >
                    NONE
                  </SeverityButton>
                </div>
              </ConfigRow>

              <ConfigRow headline="Ignore Options">
                <div className="space-y-2">
                  <IgnoreOption
                    checked={configIgnoreMethods ?? false}
                    onClick={() =>
                      models.configModel.toggleIgnoreMethods(fieldName)
                    }
                    shortcut="M"
                  >
                    Ignore Methods
                  </IgnoreOption>
                  <IgnoreOption
                    checked={configIgnoreRelatives ?? false}
                    onClick={() =>
                      models.configModel.toggleIgnoreRelatives(fieldName)
                    }
                    shortcut="R"
                  >
                    Ignore Relatives
                  </IgnoreOption>

                  <IgnoreOption
                    checked={configIgnoreInWatchMode ?? false}
                    onClick={() =>
                      models.configModel.toggleIgnoreInWatchMode(fieldName)
                    }
                    shortcut="W"
                  >
                    Ignore In Watch Mode
                  </IgnoreOption>
                </div>
              </ConfigRow>

              <ConfigRow headline="Handler">
                <div className="group relative">
                  <Code
                    className="group-hover:pointer-events-none"
                    content={configHandlerString ?? 'No handler defined'}
                  />
                  <FieldHandlerConfigDialog
                    context="config"
                    fieldName={fieldName}
                  />
                </div>
              </ConfigRow>

              <ConfigRow headline="Description">
                <DescriptionEditor
                  content={configDescription}
                  setContent={(value) =>
                    models.configModel.setFieldDescription(fieldName, value)
                  }
                />
              </ConfigRow>
            </div>
          </Tabs.Content>
          <Tabs.Content value="template" className="overflow-y-auto py-2">
            <div className="space-y-2">
              {models.templateModel.hasTemplate ? (
                <>
                  <ConfigRow
                    headline={
                      <span className="flex items-center gap-2">
                        Severity
                        <HotkeyHint label="S" />
                      </span>
                    }
                  >
                    <div className="flex gap-2">
                      <SeverityButton
                        onClick={() =>
                          models.templateModel.setFieldSeverity(
                            fieldName,
                            'HIGH',
                          )
                        }
                        isActive={templateSeverity === 'HIGH'}
                      >
                        HIGH
                      </SeverityButton>
                      <SeverityButton
                        onClick={() =>
                          models.templateModel.setFieldSeverity(
                            fieldName,
                            'LOW',
                          )
                        }
                        isActive={templateSeverity === 'LOW'}
                      >
                        LOW
                      </SeverityButton>
                      <SeverityButton
                        onClick={() =>
                          models.templateModel.setFieldSeverity(
                            fieldName,
                            undefined,
                          )
                        }
                        isActive={templateSeverity === undefined}
                      >
                        NONE
                      </SeverityButton>
                    </div>
                  </ConfigRow>

                  <ConfigRow headline="Ignore Options">
                    <div className="space-y-2">
                      <IgnoreOption
                        checked={templateIgnoreMethods ?? false}
                        onClick={() =>
                          models.templateModel.toggleIgnoreMethods(fieldName)
                        }
                        shortcut="M"
                      >
                        Ignore Methods
                      </IgnoreOption>
                      <IgnoreOption
                        checked={templateIgnoreRelatives ?? false}
                        onClick={() =>
                          models.templateModel.toggleIgnoreRelatives(fieldName)
                        }
                        shortcut="R"
                      >
                        Ignore Relatives
                      </IgnoreOption>
                      <IgnoreOption
                        checked={templateIgnoreInWatchMode ?? false}
                        onClick={() =>
                          models.templateModel.toggleIgnoreInWatchMode(
                            fieldName,
                          )
                        }
                        shortcut="W"
                      >
                        Ignore In Watch Mode
                      </IgnoreOption>
                    </div>
                  </ConfigRow>

                  <ConfigRow headline="Handler">
                    <div className="group relative">
                      <Code
                        className="group-hover:pointer-events-none"
                        content={templateHandlerString ?? 'No handler defined'}
                      />
                      <FieldHandlerConfigDialog
                        context="template"
                        fieldName={fieldName}
                      />
                    </div>
                  </ConfigRow>

                  <ConfigRow headline="Description">
                    <DescriptionEditor
                      content={templateDescription}
                      setContent={(value) =>
                        models.templateModel.setFieldDescription(
                          fieldName,
                          value,
                        )
                      }
                    />
                  </ConfigRow>
                </>
              ) : (
                <div className="text-coffee-300 text-sm italic">
                  No template available
                </div>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Dialog.Body>
    </Dialog.Root>
  )
}

function SeverityButton({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void
  isActive: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      onClick={onClick}
      className={clsx(isActive && 'bg-coffee-400/50')}
      size="small"
    >
      {children}
    </Button>
  )
}

function IgnoreOption({
  checked,
  onClick,
  children,
  shortcut,
}: {
  checked: boolean
  onClick: () => void
  children: React.ReactNode
  shortcut?: string
}) {
  return (
    <label
      className="flex w-fit cursor-pointer items-center gap-2 hover:underline"
      onClick={onClick}
    >
      <Checkbox checked={checked} onClick={onClick} />
      <span className="text-sm">{children}</span>
      {shortcut && <HotkeyHint label={shortcut} />}
    </label>
  )
}

const HOTKEYS = {
  ignoreMethods: 'm',
  ignoreRelatives: 'r',
  ignoreInWatchMode: 'w',
  configTab: 'c',
  templateTab: 't',
  severity: 's',
} as const

type Severity = 'HIGH' | 'LOW' | undefined

function getNextSeverity(current: Severity): Severity {
  if (current === 'HIGH') {
    return 'LOW'
  }
  if (current === 'LOW') {
    return undefined
  }
  return 'HIGH'
}

function HotkeyHint({ label }: { label: string }) {
  return <Kbd keys={[[label]]} size="sm" tone="dark" />
}
