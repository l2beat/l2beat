import { useEffect } from 'react'

import clsx from 'clsx'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCopy } from '../../../hooks/useCopy'
import { IconArrowToDotDown } from '../../../icons/IconArrowToDotDown'
import { IconArrowToDotUp } from '../../../icons/IconArrowToDotUp'
import { IconComment } from '../../../icons/IconComment'
import { IconCopy } from '../../../icons/IconCopy'
import { IconFoldVertical } from '../../../icons/IconFoldVertical'
import { IconShare } from '../../../icons/IconShare'
import { IconSplit } from '../../../icons/IconSplit'
import { IconSwap } from '../../../icons/IconSwap'
import { IconTick } from '../../../icons/IconTick'
import { useCodeStore } from '../store'
import { DiffEditor } from './diffEditor'
import { useDiffEditorSettings } from './hooks/useDiffEditorSettings'
import { getInlineDiff } from './utils/getInlineDiff'

export interface DiffViewProps {
  leftAddress: string
  leftCode: Record<string, string>
  rightAddress: string
  rightCode: Record<string, string>
  editorKey?: string
}

export function DiffView(props: DiffViewProps) {
  const {
    initialSelection,
    fold,
    removeUnchanged,
    removeComments,
    diff,
    url,
    setSelection,
    toggleFold,
    toggleRemoveUnchanged,
    toggleRemoveComments,
    setDiff,
    swapSides,
    leftAddress,
    rightAddress,
    splitLeft,
    splitRight,
  } = useDiffEditorSettings(props)

  const monacoEl = useRef(null)
  const { setDiffEditor, getDiffEditor } = useCodeStore()
  const editorKey = props.editorKey ?? 'default'
  const editor = getDiffEditor(editorKey)

  const { copied: urlCopied, copy: copyUrl } = useCopy()
  const { copied: inlineDiffCopied, copy: copyInlineDiff } = useCopy()

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
    return editor?.lineSelector.onSelectionChange((selection) => {
      setSelection(selection)
    })
  }, [editor])

  useEffect(() => {
    editor?.setDiff(splitLeft, splitRight)
  }, [editor, splitLeft, splitRight])

  useEffect(() => {
    editor?.lineSelector.setSelection(initialSelection)
  }, [initialSelection, editor])

  useEffect(() => {
    editor?.setFolding(fold)
  }, [fold, editor])

  editor?.onComputedDiff(setDiff)
  editor?.onComputedDiff(() => {
    editor?.lineSelector.scrollToSelection()
  })

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full flex-col items-center bg-coffee-900 shadow-[0_2px_4px_0_black]">
        <div className="relative flex w-full items-center px-4 py-3">
          <Link to="/diff">
            <img className="h-[20px]" src="/diffovery-logo.svg"></img>
          </Link>

          {/* Center Controls */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-100 flex gap-1 rounded-lg border border-coffee-700 bg-coffee-800/90 p-1 backdrop-blur-sm">
            <button
              className={clsx(
                'rounded p-1.5 transition-colors',
                removeUnchanged
                  ? 'bg-autumn-300 text-coffee-800 hover:bg-autumn-200'
                  : 'hover:bg-coffee-700',
              )}
              onClick={toggleRemoveUnchanged}
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
              onClick={toggleRemoveComments}
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
              onClick={toggleFold}
              title="Toggle folding"
            >
              <IconFoldVertical className="size-4" />
            </button>
            <button
              className={clsx(
                'rounded p-1.5 transition-colors',
                'hover:bg-coffee-700',
              )}
              onClick={swapSides}
              title="Swap sides"
            >
              <IconSwap className="size-4" />
            </button>
            <button
              className="rounded p-1.5 transition-colors hover:bg-coffee-700"
              onClick={() => {
                if (diff === undefined) {
                  return
                }

                const inlineDiff = getInlineDiff(diff, splitLeft, splitRight)
                copyInlineDiff(inlineDiff)
              }}
            >
              {!inlineDiffCopied && <IconCopy className="size-4" />}
              {inlineDiffCopied && (
                <IconTick className="block text-aux-green" />
              )}
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
            <div className="w-px bg-coffee-700" />
            <button
              className="rounded p-1.5 transition-colors hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                if (url) {
                  copyUrl(url)
                }
              }}
              title="Share"
              disabled={!url}
            >
              {!urlCopied && <IconShare className="block text-coffee-200" />}
              {urlCopied && <IconTick className="block text-aux-green" />}
            </button>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 border-coffee-200/40 border-b p-2 font-mono max-md:text-xs">
          <div className="flex w-1/2 items-center justify-center gap-2">
            <span className="truncate" title={leftAddress}>
              {leftAddress}
            </span>
            {diff && (
              <span className="inline-flex items-center rounded-full border border-aux-red/30 bg-aux-red/20 px-2 py-1 font-medium text-aux-red text-xs">
                -{diff.deletions}
              </span>
            )}
          </div>

          <div className="flex w-1/2 items-center justify-center gap-2">
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
      </div>

      <div className="h-1 bg-coffee-900" />
      <div className="h-full w-full" ref={monacoEl} />
    </div>
  )
}
