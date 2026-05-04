import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import type { Node as DiscoveryNode } from '../store/State'
import { useStore } from '../store/store'
import { SELECTABLE_COLORS } from '../view/colors/colors'
import { oklchColorToCSS } from '../view/colors/oklch'
import { ControlButton } from './ControlButton'
import { IconControlPalette } from './icons/IconControlPalette'

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

const COLOR_OPTIONS = [
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
]

type SelectionColorState =
  | { kind: 'none' }
  | { kind: 'mixed' }
  | { kind: 'single'; color: number }

export function ColorButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const colorSelected = useStore((state) => state.colorSelected)
  const selectionExists = selected.length > 0
  const selectionColorState = useMemo(
    () => getSelectionColorState(nodes, selected),
    [nodes, selected],
  )

  useEffect(() => {
    if (!selectionExists) {
      setOpen(false)
    }
  }, [selectionExists])

  function changeColor(color: number) {
    colorSelected(color)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ControlButton
          disabled={!selectionExists}
          title="Node color"
          aria-label="Change node color"
          className={clsx('h-full px-3 py-2.5', className)}
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            <IconControlPalette />
            {selectionColorState.kind !== 'none' && (
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-coffee-500"
                style={getSwatchStyle(selectionColorState)}
              />
            )}
          </span>
        </ControlButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={10}
        className="w-max max-w-[calc(100vw-2rem)] p-3"
      >
        <ColorPicker
          selectedCount={selected.length}
          selectionColorState={selectionColorState}
          onColorChange={changeColor}
        />
      </PopoverContent>
    </Popover>
  )
}

interface ColorPickerProps {
  selectedCount: number
  selectionColorState: SelectionColorState
  onColorChange: (color: number) => void
}

function ColorPicker({
  selectedCount,
  selectionColorState,
  onColorChange,
}: ColorPickerProps) {
  return (
    <div>
      <div className="mb-3 border-coffee-600/70 border-b pb-2">
        <div className="font-medium text-coffee-100 text-sm">Node color</div>
        <div className="text-[11px] text-coffee-300 leading-tight">
          {selectedCount} selected
          {' · '}
          {describeSelectionColor(selectionColorState)}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {COLOR_OPTIONS.map((option) => {
          const active =
            selectionColorState.kind === 'single' &&
            selectionColorState.color === option.id

          return (
            <button
              key={option.id}
              type="button"
              title={option.label}
              aria-label={`Set node color to ${option.label}`}
              aria-pressed={active}
              onClick={() => onColorChange(option.id)}
              className={clsx(
                'flex items-center justify-center rounded-lg border border-coffee-600 bg-coffee-800 p-2 transition-colors',
                active
                  ? 'border-autumn-300 bg-coffee-700'
                  : 'hover:bg-coffee-700',
              )}
            >
              <span
                className={clsx(
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
      <div className="mt-2 text-[11px] text-coffee-300 leading-tight">
        The first swatch resets selected nodes to their automatic chain color.
      </div>
    </div>
  )
}

function getSelectionColorState(
  nodes: readonly DiscoveryNode[],
  selectedIds: readonly string[],
): SelectionColorState {
  if (selectedIds.length === 0) {
    return { kind: 'none' }
  }

  const selectedIdSet = new Set(selectedIds)
  const selectedColors = new Set(
    nodes
      .filter((node) => selectedIdSet.has(node.id))
      .map((node) => node.color),
  )

  if (selectedColors.size !== 1) {
    return { kind: 'mixed' }
  }

  const [color] = selectedColors
  return color === undefined ? { kind: 'none' } : { kind: 'single', color }
}

function describeSelectionColor(selectionColorState: SelectionColorState) {
  if (selectionColorState.kind === 'mixed') {
    return 'Mixed colors'
  }

  if (selectionColorState.kind === 'single') {
    const option = COLOR_OPTIONS.find(
      (entry) => entry.id === selectionColorState.color,
    )
    return option ? `Current: ${option.label}` : 'Current color'
  }

  return 'No color'
}

function getSwatchStyle(selectionColorState: SelectionColorState) {
  if (selectionColorState.kind === 'mixed') {
    return {
      background:
        'linear-gradient(135deg, rgb(252 211 77) 0%, rgb(252 211 77) 48%, rgb(59 130 246) 52%, rgb(59 130 246) 100%)',
    }
  }

  if (selectionColorState.kind === 'single') {
    const option = COLOR_OPTIONS.find(
      (entry) => entry.id === selectionColorState.color,
    )
    return option ? { background: option.background } : undefined
  }

  return undefined
}
