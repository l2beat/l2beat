import { useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { useRef } from 'react'
import { useCopy } from '../../hooks/useCopy'
import { IconArrowToDotDown } from '../../icons/IconArrowToDotDown'
import { IconArrowToDotUp } from '../../icons/IconArrowToDotUp'
import { IconComment } from '../../icons/IconComment'
import { IconCopy } from '../../icons/IconCopy'
import { IconFoldVertical } from '../../icons/IconFoldVertical'
import { IconSplit } from '../../icons/IconSplit'
import { IconSwap } from '../../icons/IconSwap'
import { IconTick } from '../../icons/IconTick'
import { type Diff, DiffEditor, LineSelection } from './diffEditor'
import { splitCode } from './soliditySplitter'
import { useCodeStore } from './store'
import { useFlagFromQueryParam, useQueryParam } from './useFlagFromQueryParam'

export interface DiffViewProps {
  leftAddress: string
  leftCode: Record<string, string>
  rightAddress: string
  rightCode: Record<string, string>
  editorKey?: string
}

function useDiffEditorSettings(props: DiffViewProps) {
  const foldFromQueryParam = useFlagFromQueryParam('fold')
  const swappedFromQueryParam = useFlagFromQueryParam('swapped')
  const removeUnchangedFromQueryParam = useFlagFromQueryParam('removeUnchanged')
  const removeCommentsFromQueryParam = useFlagFromQueryParam('removeComments')
  const [url, setUrl] = useState<string | null>(null)
  const [selection, setSelection] = useState<LineSelection | null>(null)
  const [initialSelection, setInitialSelection] =
    useState<LineSelection | null>(null)

  const [fold, setFold] = useState(foldFromQueryParam)
  const [swapped, setSwapped] = useState(swappedFromQueryParam)
  const [removeUnchanged, setRemoveUnchanged] = useState(
    removeUnchangedFromQueryParam ??
      !codeIsTheSame(props.leftCode, props.rightCode),
  )
  const [removeComments, setRemoveComments] = useState(
    removeCommentsFromQueryParam,
  )
  const [diff, setDiff] = useState<Diff | undefined>(undefined)

  useEffect(() => {
    const encoded = useQueryParam('lines')
    if (encoded) {
      const selection = LineSelection.decode(encoded)
      setSelection(selection)
      setInitialSelection(selection)
    }
  }, [])

  useEffect(() => {
    const encoded = selection ? LineSelection.encode(selection) : null
    const url = new URL(window.location.href)
    url.searchParams.set('lines', encoded ?? '')
    url.searchParams.set('fold', fold.toString())
    url.searchParams.set('swapped', swapped.toString())
    url.searchParams.set('removeUnchanged', removeUnchanged.toString())
    url.searchParams.set('removeComments', removeComments.toString())
    setUrl(url.toString())
  }, [selection])

  return {
    initialSelection,
    fold,
    swapped,
    removeUnchanged,
    removeComments,
    diff,
    url,
    setSelection,
    setFold,
    setSwapped,
    setRemoveUnchanged,
    setRemoveComments,
    setDiff,
  }
}

export function DiffView(props: DiffViewProps) {
  const {
    initialSelection,
    fold,
    swapped,
    removeUnchanged,
    removeComments,
    diff,
    url,
    setSelection,
    setFold,
    setSwapped,
    setRemoveUnchanged,
    setRemoveComments,
    setDiff,
  } = useDiffEditorSettings(props)
  const monacoEl = useRef(null)
  const { setDiffEditor, getDiffEditor } = useCodeStore()
  const editorKey = props.editorKey ?? 'default'
  const editor = getDiffEditor(editorKey)
  const [leftAddress, rightAddress] = swapped
    ? [props.rightAddress, props.leftAddress]
    : [props.leftAddress, props.rightAddress]

  const { copied, copy } = useCopy()

  useEffect(() => {
    if (!monacoEl.current) {
      return
    }

    const editor = new DiffEditor(monacoEl.current)
    setDiffEditor(editorKey, editor)

    function onResize() {
      editor.resize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [setDiffEditor, editorKey])

  useEffect(() => {
    editor?.resize()
  }, [editor])

  useEffect(() => {
    return editor?.onSelectionChange((selection) => {
      setSelection(selection)
    })
  }, [editor])

  const [splitLeft, splitRight] = useMemo(() => {
    return splitCode(
      props.leftCode,
      props.rightCode,
      removeUnchanged,
      removeComments,
    )
  }, [props.leftCode, props.rightCode, removeUnchanged, removeComments])

  useEffect(() => {
    editor?.setDiff(splitLeft, splitRight)
  }, [editor, splitLeft, splitRight])

  useEffect(() => {
    editor?.setSelection(initialSelection)
  }, [initialSelection, editor])

  editor?.onComputedDiff(setDiff)
  editor?.onComputedDiff(() => {
    editor?.scrollToSelection()
  })

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative z-10 flex w-full items-center bg-coffee-900 shadow-[0_2px_4px_0_black]">
        <div className="flex-1 px-4 py-3 text-left">
          <div className="flex items-center gap-2 font-mono">
            <span className="truncate" title={leftAddress}>
              {leftAddress}
            </span>
            {diff && (
              <span className="inline-flex items-center rounded-full border border-aux-red/30 bg-aux-red/20 px-2 py-1 font-medium text-aux-red text-xs">
                -{diff.deletions}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2 font-mono">
            {diff && (
              <span className="inline-flex items-center rounded-full border border-aux-green/30 bg-aux-green/20 px-2 py-1 font-medium text-aux-green text-xs">
                +{diff.additions}
              </span>
            )}
            <span className="truncate" title={rightAddress}>
              {rightAddress}
            </span>
          </div>
        </div>

        {/* Center Controls */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-100 flex gap-1 rounded-lg border border-coffee-700 bg-coffee-800/90 p-1 backdrop-blur-sm">
          <button
            className={clsx(
              'rounded p-1.5 transition-colors',
              removeUnchanged
                ? 'bg-autumn-300 text-coffee-800 hover:bg-autumn-200'
                : 'hover:bg-coffee-700',
            )}
            onClick={() => setRemoveUnchanged(!removeUnchanged)}
            title="Toggle unchanged sections"
          >
            <IconSplit className="size-4" />
          </button>
          <button
            className={clsx(
              'rounded p-1.5 transition-colors',
              removeComments
                ? 'bg-autumn-300 text-coffee-800 hover:bg-autumn-200'
                : 'hover:bg-coffee-700',
            )}
            title="Toggle comments"
            onClick={() => setRemoveComments(!removeComments)}
          >
            <IconComment className="size-4" />
          </button>
          <button
            className={clsx(
              'rounded p-1.5 transition-colors',
              fold
                ? 'bg-autumn-300 text-coffee-800 hover:bg-autumn-200'
                : 'hover:bg-coffee-700',
            )}
            onClick={() => {
              editor?.setFolding(!fold)
              setFold(!fold)
            }}
            title="Toggle folding"
          >
            <IconFoldVertical className="size-4" />
          </button>
          <button
            className={clsx(
              'rounded p-1.5 transition-colors',
              swapped
                ? 'bg-autumn-300 text-coffee-800 hover:bg-autumn-200'
                : 'hover:bg-coffee-700',
            )}
            // TODO(radomski): On swap change the URL, don't style the button
            onClick={() => setSwapped(editor?.swapSides() ?? false)}
            title="Swap sides"
          >
            <IconSwap className="size-4" />
          </button>
          <div className="w-px bg-coffee-700" />
          <button
            className="rounded p-1.5 transition-colors hover:bg-coffee-700"
            onClick={() => editor?.toNextDiff()}
            title="Next difference"
          >
            <IconArrowToDotDown className="size-4" />
          </button>
          <button
            className="rounded p-1.5 transition-colors hover:bg-coffee-700"
            onClick={() => editor?.toPreviousDiff()}
            title="Previous difference"
          >
            <IconArrowToDotUp className="size-4" />
          </button>
          <button
            className="rounded p-1.5 transition-colors hover:bg-coffee-700"
            onClick={() => copy(url ?? '')}
            title="Share"
          >
            {!copied && <IconCopy className="block text-coffee-600" />}
            {copied && <IconTick className="block text-aux-green" />}
          </button>
        </div>
      </div>
      <div className="h-1 bg-coffee-900" />
      <div className="h-full w-full" ref={monacoEl} />
    </div>
  )
}

function codeIsTheSame(
  left: Record<string, string>,
  right: Record<string, string>,
): boolean {
  const [leftCode, rightCode] = splitCode(left, right)
  return leftCode === rightCode
}
