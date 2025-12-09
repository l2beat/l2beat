import clsx from 'clsx'
import type { Field } from '../../../../api/types'
import { Button } from '../../../../components/Button'
import { Checkbox } from '../../../../components/Checkbox'
import { Dialog } from '../../../../components/Dialog'
import { IconGear } from '../../../../icons/IconGear'
import { useConfigModels } from '../../hooks/useConfigModels'

type Props = {
  field: Field
}

export function FieldConfigDialog(props: Props) {
  const models = useConfigModels()

  const fieldName = props.field.name

  const configSeverity = models.configModel.getFieldSeverity(fieldName)
  const templateSeverity = models.templateModel.getFieldSeverity(fieldName)

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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="icon" size="icon">
          <IconGear className="size-4 text-coffee-200/80" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Body>
        <Dialog.Title>
          Field - <span className="font-mono text-coffee-400">{fieldName}</span>
        </Dialog.Title>
        <div className="grid grid-cols-2 gap-6">
          {/* Config Column */}
          <div className="space-y-4">
            <h3 className="border-coffee-400/40 border-b pb-1 text-base">
              Config
            </h3>

            <div>
              <h4 className="mb-2 font-medium text-sm">Severity</h4>
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
            </div>

            <div>
              <h4 className="mb-2 font-medium text-sm">Ignore Options</h4>
              <div className="space-y-2">
                <label
                  className="flex cursor-pointer items-center gap-2 hover:underline"
                  onClick={() =>
                    models.configModel.toggleIgnoreMethods(fieldName)
                  }
                >
                  <Checkbox checked={configIgnoreMethods ?? false} />
                  <span className="text-sm">Ignore Methods</span>
                </label>
                <label
                  className="flex cursor-pointer items-center gap-2 hover:underline"
                  onClick={() =>
                    models.configModel.toggleIgnoreRelatives(fieldName)
                  }
                >
                  <Checkbox checked={configIgnoreRelatives ?? false} />
                  <span className="text-sm">Ignore Relatives</span>
                </label>
                <label
                  className="flex cursor-pointer items-center gap-2 hover:underline"
                  onClick={() =>
                    models.configModel.toggleIgnoreInWatchMode(fieldName)
                  }
                >
                  <Checkbox checked={configIgnoreInWatchMode ?? false} />
                  <span className="text-sm">Ignore In Watch Mode</span>
                </label>
              </div>
            </div>
          </div>

          {/* Template Column */}
          <div className="space-y-4">
            <h3 className="border-coffee-400/40 border-b pb-1 text-base">
              Template
            </h3>

            {models.templateModel.hasTemplate ? (
              <>
                <div>
                  <h4 className="mb-2 font-medium text-sm">Severity</h4>
                  <div className="flex gap-2">
                    <SeverityButton
                      onClick={() =>
                        models.templateModel.setFieldSeverity(fieldName, 'HIGH')
                      }
                      isActive={templateSeverity === 'HIGH'}
                    >
                      HIGH
                    </SeverityButton>
                    <SeverityButton
                      onClick={() =>
                        models.templateModel.setFieldSeverity(fieldName, 'LOW')
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
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-sm">Ignore Options</h4>
                  <div className="space-y-2">
                    <label
                      className="flex cursor-pointer items-center gap-2 hover:underline"
                      onClick={() =>
                        models.templateModel.toggleIgnoreMethods(fieldName)
                      }
                    >
                      <Checkbox
                        checked={templateIgnoreMethods ?? false}
                        onClick={() =>
                          models.templateModel.toggleIgnoreMethods(fieldName)
                        }
                      />
                      <span className="text-sm">Ignore Methods</span>
                    </label>
                    <label
                      className="flex cursor-pointer items-center gap-2 hover:underline"
                      onClick={() =>
                        models.templateModel.toggleIgnoreRelatives(fieldName)
                      }
                    >
                      <Checkbox
                        checked={templateIgnoreRelatives ?? false}
                        onClick={() =>
                          models.templateModel.toggleIgnoreRelatives(fieldName)
                        }
                      />
                      <span className="text-sm">Ignore Relatives</span>
                    </label>
                    <label
                      className="flex cursor-pointer items-center gap-2 hover:underline"
                      onClick={() =>
                        models.templateModel.toggleIgnoreInWatchMode(fieldName)
                      }
                    >
                      <Checkbox checked={templateIgnoreInWatchMode ?? false} />
                      <span className="text-sm">Ignore In Watch Mode</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-coffee-300 text-sm italic">
                No template available
              </div>
            )}
          </div>
        </div>
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
