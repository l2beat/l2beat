import clsx from 'clsx'
import { useMemo, useState } from 'react'
import type { ApiCodeSegment } from '../../../api/types'
import { Button } from '../../../components/Button'
import { Dialog } from '../../../components/Dialog'
import { useCopy } from '../../../hooks/useCopy'
import { IconCopy } from '../../../icons/IconCopy'
import { IconTick } from '../../../icons/IconTick'
import { joinSelectedDeclarations } from './declarations'
import { KNOWN_LIBRARY_NAMES } from './knownLibraryNames'

interface NamedDeclaration {
  index: number
  name: string
  lineCount: number
  charCount: number
  isKnownLibrary: boolean
}

interface CarveCopyDialogProps {
  sourceName: string
  declarations: ApiCodeSegment[]
}

export function CarveCopyDialog(props: CarveCopyDialogProps) {
  const named = useMemo(
    () => toNamedDeclarations(props.declarations),
    [props.declarations],
  )
  const [selected, setSelected] = useState<Set<number>>(() => defaults(named))

  const stats = useMemo(() => {
    let lines = 0
    let chars = 0
    for (const declaration of named) {
      if (selected.has(declaration.index)) {
        lines += declaration.lineCount
        chars += declaration.charCount
      }
    }
    // Rough heuristic: ~4 characters per token is close enough for budgeting.
    return { lines, tokens: Math.round(chars / 4) }
  }, [named, selected])

  const summary =
    selected.size === 0
      ? `0 of ${named.length} selected`
      : `${selected.size} of ${named.length} selected · ~${stats.lines.toLocaleString()} lines · ~${formatCompact(stats.tokens)} tokens`

  const { copied, copy } = useCopy()

  function toggle(index: number) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <Dialog.Root
      onOpenChange={(open: boolean) => {
        if (open) {
          setSelected(defaults(named))
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="solid" size="small" disabled={named.length === 0}>
          Carve Copy
        </Button>
      </Dialog.Trigger>
      <Dialog.Body className="max-w-[640px]">
        <Dialog.Title>Carve Copy</Dialog.Title>
        <p className="mb-3 text-coffee-200 text-sm">
          Select the declarations to copy from{' '}
          <span className="font-mono">{props.sourceName}</span>. Well-known
          libraries are deselected by default.
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="small" onClick={() => setSelected(allIndices(named))}>
            Select all
          </Button>
          <Button size="small" onClick={() => setSelected(new Set())}>
            Deselect all
          </Button>
          <Button
            size="small"
            onClick={() => setSelected((c) => withoutKnown(c, named))}
          >
            Deselect known libraries
          </Button>
        </div>

        <div className="mb-4 flex max-h-[50vh] flex-wrap content-start justify-center gap-2 overflow-y-auto">
          {named.map((declaration) => {
            const isSelected = selected.has(declaration.index)
            return (
              <button
                key={declaration.index}
                type="button"
                onClick={() => toggle(declaration.index)}
                title={`${declaration.name} · ${declaration.lineCount} lines`}
                className={clsx(
                  'flex items-center gap-2 border px-2.5 py-1.5 font-mono text-sm transition-colors',
                  isSelected
                    ? 'border-autumn-300 bg-autumn-300 text-black'
                    : 'border-coffee-400 bg-coffee-700 text-coffee-300 hover:border-coffee-200 hover:text-coffee-100',
                )}
              >
                <span className="truncate">{declaration.name}</span>
                <span
                  className={clsx(
                    'text-xs',
                    isSelected ? 'text-black/50' : 'text-coffee-400',
                  )}
                >
                  {declaration.lineCount}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-coffee-400 text-sm">{summary}</span>
          <Button
            variant="solid"
            onClick={() =>
              copy(
                joinSelectedDeclarations(props.declarations, (i) =>
                  selected.has(i),
                ),
              )
            }
            disabled={selected.size === 0}
            className="gap-2"
          >
            {copied ? (
              <IconTick className="h-4 w-4 text-aux-green" />
            ) : (
              <IconCopy className="h-4 w-4" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}

function formatCompact(value: number): string {
  if (value < 1000) {
    return String(value)
  }
  return `${(value / 1000).toFixed(1)}k`
}

function toNamedDeclarations(
  declarations: ApiCodeSegment[],
): NamedDeclaration[] {
  const named: NamedDeclaration[] = []
  for (const [index, declaration] of declarations.entries()) {
    if (declaration.name === null) {
      continue
    }
    const trimmed = declaration.content.trim()
    named.push({
      index,
      name: declaration.name,
      lineCount: trimmed.split('\n').length,
      charCount: trimmed.length,
      isKnownLibrary: KNOWN_LIBRARY_NAMES.has(declaration.name),
    })
  }
  return named
}

function defaults(named: NamedDeclaration[]): Set<number> {
  return new Set(named.filter((d) => !d.isKnownLibrary).map((d) => d.index))
}

function allIndices(named: NamedDeclaration[]): Set<number> {
  return new Set(named.map((d) => d.index))
}

function withoutKnown(
  current: Set<number>,
  named: NamedDeclaration[],
): Set<number> {
  const known = new Set(
    named.filter((d) => d.isKnownLibrary).map((d) => d.index),
  )
  const next = new Set(current)
  for (const index of known) {
    next.delete(index)
  }
  return next
}
