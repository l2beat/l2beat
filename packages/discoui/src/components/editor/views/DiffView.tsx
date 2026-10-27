import { useEffect } from 'react'
import { Link } from 'react-router'
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
import { cn } from '../../../utils/cn'
import { DiffEditorComponent } from '../diff/DiffEditorComponent'
import type { DiffVerdict } from '../diff/diffVerdict'
import { useDiffEditorSettings } from '../diff/hooks/useDiffEditorSettings'
import { LineSelector } from '../diff/plugins/lineSelector'
import { getInlineDiff } from '../diff/utils/getInlineDiff'
import { useCodeStore } from '../store'

export interface DiffViewProps {
  leftAddress: string
  leftCode: Record<string, string>
  rightAddress: string
  rightCode: Record<string, string>
  // EOAs and unverified contracts come as placeholder text, which can't
  // tell whether two contracts are the same.
  bothSidesHaveSource: boolean
  editorKey: string
}

export function DiffView(props: DiffViewProps) {
  const {
    initialSelection,
    fold,
    removeUnchanged,
    ignoreComments,
    diff,
    url,
    setSelection,
    toggleFold,
    toggleRemoveUnchanged,
    toggleIgnoreComments,
    setDiff,
    swapSides,
    leftAddress,
    rightAddress,
    splitLeft,
    splitRight,
  } = useDiffEditorSettings(props)

  const editor = useCodeStore((store) => store.diffEditors[props.editorKey])

  const { copied: urlCopied, copy: copyUrl } = useCopy()
  const { copied: inlineDiffCopied, copy: copyInlineDiff } = useCopy()

  useEffect(() => {
    return editor?.getPlugin(LineSelector)?.onSelectionChange((selection) => {
      setSelection(selection)
    })
  }, [editor])

  useEffect(() => {
    editor?.setDiff(splitLeft, splitRight)
  }, [editor, splitLeft, splitRight])

  useEffect(() => {
    editor?.getPlugin(LineSelector)?.setSelection(initialSelection)
  }, [initialSelection, editor])

  useEffect(() => {
    editor?.setFolding(fold)
  }, [fold, editor])

  useEffect(() => {
    editor?.setIgnoreComments(ignoreComments)
  }, [ignoreComments, editor])

  useEffect(() => {
    if (!editor) {
      return
    }
    const diffDisposable = editor.onComputedDiff(setDiff)
    const scrollDisposable = editor.onComputedDiff(() => {
      editor.getPlugin(LineSelector)?.scrollToSelection()
    })
    return () => {
      diffDisposable.dispose()
      scrollDisposable.dispose()
    }
  }, [editor, setDiff])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 border-coffee-200/40 border-b bg-coffee-900 px-4 py-2 shadow-[0_2px_4px_0_black]">
        {/* Left section: logo and left address */}
        <div className="flex min-w-0 items-center gap-4">
          <Link to="/diff" className="shrink-0 items-center">
            <img className="h-[20px]" src="/diffovery-logo.svg" />
          </Link>
          <div className="flex min-w-0 items-center gap-2 font-mono max-md:text-xs">
            <span className="truncate leading-none" title={leftAddress}>
              {leftAddress}
            </span>
            {diff && (
              <span className="inline-flex items-center rounded-full border border-aux-red/30 bg-aux-red/20 px-2 py-1 font-medium text-aux-red text-xs">
                -{diff.deletions}
              </span>
            )}
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex gap-1 rounded-lg border border-coffee-700 bg-coffee-800/90 p-1 backdrop-blur-xs">
          <button
            className={cn(
              'rounded-sm p-1.5 transition-colors',
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
            className={cn(
              'rounded-sm p-1.5 transition-colors',
              ignoreComments
                ? 'bg-autumn-300 text-coffee-800 hover:bg-autumn-200'
                : 'hover:bg-coffee-700',
            )}
            title="Toggle comments"
            onClick={toggleIgnoreComments}
          >
            <IconComment className="size-4" />
          </button>
          <button
            className={cn(
              'rounded-sm p-1.5 transition-colors',
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
            className={cn(
              'rounded-sm p-1.5 transition-colors',
              'hover:bg-coffee-700',
            )}
            onClick={swapSides}
            title="Swap sides"
          >
            <IconSwap className="size-4" />
          </button>
          <div className="w-px bg-coffee-700" />
          <button
            className="rounded-sm p-1.5 transition-colors hover:bg-coffee-700"
            onClick={() => editor?.toNextDiff()}
            title="Next difference"
          >
            <IconArrowToDotDown className="size-4" />
          </button>
          <button
            className="rounded-sm p-1.5 transition-colors hover:bg-coffee-700"
            onClick={() => editor?.toPreviousDiff()}
            title="Previous difference"
          >
            <IconArrowToDotUp className="size-4" />
          </button>
          <div className="w-px bg-coffee-700" />
          <button
            className="rounded-sm p-1.5 transition-colors hover:bg-coffee-700"
            onClick={() => {
              if (diff === undefined) {
                return
              }

              const inlineDiff = getInlineDiff(diff, splitLeft, splitRight)
              copyInlineDiff(inlineDiff)
            }}
          >
            {!inlineDiffCopied && <IconCopy className="size-4" />}
            {inlineDiffCopied && <IconTick className="block text-aux-green" />}
          </button>
          <button
            className="rounded-sm p-1.5 transition-colors hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Right section: right address */}
        <div className="flex min-w-0 items-center justify-end gap-2 font-mono max-md:text-xs">
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
      {props.bothSidesHaveSource && diff && diff.verdict !== 'different' && (
        <SameCodeBanner
          verdict={diff.verdict}
          unchangedHidden={removeUnchanged}
          onShowUnchanged={toggleRemoveUnchanged}
        />
      )}
      <div className="h-1 bg-coffee-900" />
      <DiffEditorComponent editorKey={props.editorKey} />
    </div>
  )
}

const SAME_CODE_MESSAGES: Record<Exclude<DiffVerdict, 'different'>, string> = {
  identical: 'The contracts are identical',
  formattingDiffers:
    'The contracts have the same code, only formatting differs',
  sameIgnoringComments:
    'The contracts have the same code, ignoring comments and formatting',
}

function SameCodeBanner(props: {
  verdict: Exclude<DiffVerdict, 'different'>
  unchangedHidden: boolean
  onShowUnchanged: () => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 border-aux-green/30 border-b bg-aux-green/10 px-4 py-1.5 text-aux-green text-sm">
      <IconTick className="size-4 shrink-0" />
      <span>{SAME_CODE_MESSAGES[props.verdict]}</span>
      {props.unchangedHidden && (
        <button
          className="rounded-sm px-1.5 text-coffee-200 underline transition-colors hover:text-coffee-100"
          onClick={props.onShowUnchanged}
        >
          Show unchanged declarations
        </button>
      )}
    </div>
  )
}
