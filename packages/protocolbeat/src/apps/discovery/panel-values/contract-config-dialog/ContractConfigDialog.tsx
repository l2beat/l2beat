import { Button } from '../../../../components/Button'
import { Dialog } from '../../../../components/Dialog'
import { Tabs } from '../../../../components/Tabs'
import { IconGear } from '../../../../icons/IconGear'
import { useConfigModels } from '../../hooks/useConfigModels'
import { useProjectData } from '../../hooks/useProjectData'
import { CategorySelect } from './CategorySelect'
import { DescriptionEditor } from './DescriptionEditor'

export function ContractConfigDialog() {
  const { selected } = useProjectData()
  const models = useConfigModels()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="icon" size="icon">
          <IconGear className="size-4 text-coffee-200/80" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Body>
        <Dialog.Title>
          Contract -{' '}
          <span className="font-mono text-coffee-400">
            {selected?.name ?? 'Unknown'}
          </span>
        </Dialog.Title>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger value="config">Config</Tabs.Trigger>
            <Tabs.Trigger value="template">Template</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="config">
            <div className="space-y-2">
              <ConfigRow headline="Category">
                <CategorySelect
                  category={models.configModel.category}
                  setCategory={(value) => models.configModel.setCategory(value)}
                />
              </ConfigRow>
              <ConfigRow headline="Description">
                <DescriptionEditor
                  content={models.configModel.description}
                  setContent={(value) =>
                    models.configModel.setDescription(value)
                  }
                />
              </ConfigRow>
            </div>
          </Tabs.Content>
          <Tabs.Content value="template">
            <div className="space-y-2">
              {models.templateModel.hasTemplate ? (
                <>
                  <ConfigRow headline="Category">
                    <CategorySelect
                      category={models.templateModel.category}
                      setCategory={(value) =>
                        models.templateModel.setCategory(value)
                      }
                    />
                  </ConfigRow>
                  <ConfigRow headline="Description">
                    <DescriptionEditor
                      content={models.templateModel.description}
                      setContent={(value) =>
                        models.templateModel.setDescription(value)
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

export function ConfigRow({
  headline,
  children,
}: {
  headline: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-coffee-200 text-sm">{headline}</h4>
      {children}
    </div>
  )
}
