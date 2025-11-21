import { Button } from '../../../../components/Button'
import { Dialog } from '../../../../components/Dialog'
import { Select } from '../../../../components/Select'
import { IconClose } from '../../../../icons/IconClose'
import { IconGear } from '../../../../icons/IconGear'
import { useConfigModels } from '../../hooks/useConfigModels'
import { useProjectData } from '../../hooks/useProjectData'

const CATEGORIES = {
  core: {
    name: 'Local Infrastructure',
    priority: 5,
  },
  shared: {
    name: 'Shared Infrastructure',
    priority: 4,
  },
  gov: {
    name: 'Governance',
    priority: 3,
  },
  'bridge-canonical': {
    name: 'Canonical Bridges',
    priority: 2,
  },
  'bridge-external': {
    name: 'External Bridges',
    priority: 1,
  },
  spam: {
    name: 'Spam',
    priority: -1,
  },
}

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
        <div className="grid grid-cols-2 gap-6">
          {/* Config Column */}
          <div className="space-y-4">
            <h3 className="border-coffee-400/40 border-b pb-1 text-base">
              Config
            </h3>

            <div>
              <h4 className="mb-2 font-medium text-sm">Category</h4>
              <CategorySelect
                category={models.configModel.category}
                setCategory={(value) => models.configModel.setCategory(value)}
              />
            </div>
          </div>

          {/* Template Column */}
          <div className="space-y-4">
            <h3 className="border-coffee-400/40 border-b pb-1 font-medium text-base">
              Template
            </h3>

            {models.templateModel.hasTemplate ? (
              <>
                <div>
                  <h4 className="mb-2 font-medium text-sm">Category</h4>
                  <CategorySelect
                    category={models.templateModel.category}
                    setCategory={(value) =>
                      models.templateModel.setCategory(value)
                    }
                  />
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

function CategorySelect({
  category,
  setCategory,
}: {
  category: string | undefined
  setCategory: (category: string | undefined) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Select.Root
        onValueChange={(value) => {
          console.log('value', value)
          setCategory(value || undefined)
        }}
        value={category ?? ''}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Label>Available categories</Select.Label>
            {Object.entries(CATEGORIES).map(([value, category]) => (
              <Select.Item key={value} value={value}>
                {category.name} ({value})
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Button
        variant="icon"
        size="icon"
        onClick={() => setCategory(undefined)}
        disabled={!category}
      >
        <IconClose className="size-4 text-coffee-200/80" />
      </Button>
    </div>
  )
}
