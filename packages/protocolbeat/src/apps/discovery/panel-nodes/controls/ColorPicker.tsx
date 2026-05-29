import { cn } from '../../../../utils/cn'
import { SELECTABLE_COLORS } from '../view/colors/colors'
import { oklchColorToCSS } from '../view/colors/oklch'

const AUTO_SWATCH_BACKGROUND =
  'conic-gradient(#9ED110, #50B517, #179067, #476EAF, #9F49AC, #CC42A2, #FF3BA7, #FF5800, #FF8100, #FEAC00, #FFCC00, #EDE604, #9ED110)'

const COLOR_LABELS = [
  'Red',
  'Orange',
  'Yellow',
  'Teal',
  'Green',
  'Cyan',
  'Blue',
  'Purple',
  'Pink',
  'White',
  'Black',
] as const

export const COLOR_OPTIONS = [
  {
    id: 0,
    label: 'Auto',
    background: AUTO_SWATCH_BACKGROUND,
  },
  ...SELECTABLE_COLORS.map((entry, index) => ({
    id: index + 1,
    label: COLOR_LABELS[index] ?? `Color ${index + 1}`,
    background: oklchColorToCSS(entry.color),
  })),
] as const

export const ENTRYPOINT_COLOR_COUNT = SELECTABLE_COLORS.length

export type ColorPickerValue = number

export interface ColorPickerProps {
  value: ColorPickerValue
  onChange: (color: ColorPickerValue) => void
  title?: string
  description?: string
  showAutoOption?: boolean
}

export function ColorPicker({
  value,
  onChange,
  title = 'Color',
  description,
  showAutoOption = true,
}: ColorPickerProps) {
  const options = showAutoOption
    ? COLOR_OPTIONS
    : COLOR_OPTIONS.filter((option) => option.id !== 0)

  const activeOption = COLOR_OPTIONS.find((option) => option.id === value)

  return (
    <div>
      <div className="mb-3 border-coffee-600/70 border-b pb-2">
        <div className="font-medium text-coffee-100 text-sm">{title}</div>
        {description && (
          <div className="text-[11px] text-coffee-300 leading-tight">
            {description}
          </div>
        )}
        {activeOption && (
          <div className="mt-1 text-[11px] text-coffee-300 leading-tight">
            Selected: {activeOption.label}
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-2">
        {options.map((option) => {
          const active = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              title={option.label}
              aria-label={`Set color to ${option.label}`}
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={cn(
                'flex items-center justify-center rounded-lg border border-coffee-600 bg-coffee-800 p-2 transition-colors',
                active
                  ? 'border-autumn-300 bg-coffee-700'
                  : 'hover:bg-coffee-700',
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 rounded-full border',
                  option.label === 'White'
                    ? 'border-coffee-500'
                    : option.label === 'Black'
                      ? 'border-coffee-400'
                      : 'border-black/10',
                )}
                style={{ background: option.background }}
              />
            </button>
          )
        })}
      </div>
      {showAutoOption && (
        <div className="mt-2 text-[11px] text-coffee-300 leading-tight">
          Auto uses the default chain color for nodes.
        </div>
      )}
    </div>
  )
}
