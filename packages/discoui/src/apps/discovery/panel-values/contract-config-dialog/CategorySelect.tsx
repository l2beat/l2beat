import { Button } from '../../../../components/Button'
import { Select } from '../../../../components/Select'
import { IconClose } from '../../../../icons/IconClose'

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

export function CategorySelect({
  category,
  setCategory,
}: {
  category: string | undefined
  setCategory: (category: string | undefined) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Select.Root
        onValueChange={(value) => setCategory(value || undefined)}
        value={category ?? ''}
      >
        <Select.Trigger className="w-full" placeholder="No category" />
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
