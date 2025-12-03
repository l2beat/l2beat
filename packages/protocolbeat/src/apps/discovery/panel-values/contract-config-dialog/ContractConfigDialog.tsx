import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../../components/Button'
import { Dialog } from '../../../../components/Dialog'
import { Select } from '../../../../components/Select'
import { useDebounce } from '../../../../hooks/useDebounce'
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

export function ContractConfigDialog({
  open,
  onOpenChange,
  trigger,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}) {
  const { selected } = useProjectData()
  const models = useConfigModels()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? (open ?? false) : internalOpen
  const handleOpenChange = isControlled
    ? (onOpenChange ?? (() => {}))
    : setInternalOpen

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      ) : (
        <Dialog.Trigger asChild>
          <Button variant="icon" size="icon">
            <IconGear className="size-4 text-coffee-200/80" />
          </Button>
        </Dialog.Trigger>
      )}
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

            <div>
              <h4 className="mb-2 font-medium text-sm">Description</h4>
              <DescriptionInput
                description={models.configModel.description}
                setDescription={(value) =>
                  models.configModel.setDescription(value)
                }
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

                <div>
                  <h4 className="mb-2 font-medium text-sm">Description</h4>
                  <DescriptionInput
                    description={models.templateModel.description}
                    setDescription={(value) =>
                      models.templateModel.setDescription(value)
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

function DescriptionInput({
  description,
  setDescription,
}: {
  description: string | undefined
  setDescription: (description: string | undefined) => void
}) {
  const [localValue, setLocalValue] = useState(description ?? '')
  const debouncedValue = useDebounce(localValue, 500)
  const isInternalUpdateRef = useRef(false)

  // Sync local state when prop changes externally (not from our own updates)
  useEffect(() => {
    if (!isInternalUpdateRef.current) {
      setLocalValue(description ?? '')
    }
    isInternalUpdateRef.current = false
  }, [description])

  // Call setDescription when debounced value changes
  useEffect(() => {
    const trimmed = debouncedValue.trim() || undefined
    if (trimmed !== description) {
      isInternalUpdateRef.current = true
      setDescription(trimmed)
    }
  }, [debouncedValue, setDescription, description])

  return (
    <div className="flex items-start gap-1">
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Enter description..."
        className={clsx(
          'min-h-20 w-full resize-y border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
        rows={4}
      />
      <Button
        variant="icon"
        size="icon"
        onClick={() => {
          setLocalValue('')
          setDescription(undefined)
        }}
        disabled={!localValue.trim()}
        className="mt-1"
      >
        <IconClose className="size-4 text-coffee-200/80" />
      </Button>
    </div>
  )
}
