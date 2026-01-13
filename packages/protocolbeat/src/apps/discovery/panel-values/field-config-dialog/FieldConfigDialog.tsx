import clsx from 'clsx'
import type { Field } from '../../../../api/types'
import { Button } from '../../../../components/Button'
import { Checkbox } from '../../../../components/Checkbox'
import { Code } from '../../../../components/Code'
import { Dialog } from '../../../../components/Dialog'
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="icon" size="icon">
          <IconGear className="size-4 text-coffee-200/80" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Body className="flex flex-col overflow-hidden">
        <Dialog.Title>
          Field - <span className="font-mono text-coffee-400">{fieldName}</span>
        </Dialog.Title>
        <Tabs.Root className="flex min-h-0 flex-1 flex-col">
          <Tabs.List>
            <Tabs.Trigger value="config">Config</Tabs.Trigger>
            <Tabs.Trigger value="template">Template</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="config" className="overflow-y-auto py-2">
            <div className="space-y-2">
              <ConfigRow headline="Severity">
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
                  >
                    Ignore Methods
                  </IgnoreOption>
                  <IgnoreOption
                    checked={configIgnoreRelatives ?? false}
                    onClick={() =>
                      models.configModel.toggleIgnoreRelatives(fieldName)
                    }
                  >
                    Ignore Relatives
                  </IgnoreOption>

                  <IgnoreOption
                    checked={configIgnoreInWatchMode ?? false}
                    onClick={() =>
                      models.configModel.toggleIgnoreInWatchMode(fieldName)
                    }
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
                  <ConfigRow headline="Severity">
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
                      >
                        Ignore Methods
                      </IgnoreOption>
                      <IgnoreOption
                        checked={templateIgnoreRelatives ?? false}
                        onClick={() =>
                          models.templateModel.toggleIgnoreRelatives(fieldName)
                        }
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
}: {
  checked: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <label
      className="flex w-fit cursor-pointer items-center gap-2 hover:underline"
      onClick={onClick}
    >
      <Checkbox checked={checked} onClick={onClick} />
      <span className="text-sm">{children}</span>
    </label>
  )
}
