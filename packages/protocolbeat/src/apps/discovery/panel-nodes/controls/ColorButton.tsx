import { useEffect, useMemo, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import { cn } from '../../../../utils/cn'
import type { Node as DiscoveryNode } from '../store/State'
import { useStore } from '../store/store'
import { COLOR_OPTIONS, ColorPicker } from './ColorPicker'
import { ControlButton } from './ControlButton'
import { IconControlPalette } from './icons/IconControlPalette'

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

  const pickerValue =
    selectionColorState.kind === 'single' ? selectionColorState.color : 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ControlButton
          disabled={!selectionExists}
          title="Node color"
          aria-label="Change node color"
          className={cn('h-full px-3 py-2.5', className)}
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
          value={pickerValue}
          onChange={changeColor}
          title="Node color"
          description={`${selected.length} selected · ${describeSelectionColor(selectionColorState)}`}
        />
      </PopoverContent>
    </Popover>
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
