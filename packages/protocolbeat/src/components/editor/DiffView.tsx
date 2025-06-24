import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { useRef } from 'react'
import { IconArrowToDotDown } from '../../icons/IconArrowToDotDown'
import { IconArrowToDotUp } from '../../icons/IconArrowToDotUp'
import { IconFoldVertical } from '../../icons/IconFoldVertical'
import { IconSplit } from '../../icons/IconSplit'
import { IconSwap } from '../../icons/IconSwap'
import { type Diff, DiffEditor } from './diffEditor'
import { splitCode } from './soliditySplitter'
import { useCodeStore } from './store'

export interface DiffViewProps {
  leftAddress: string
  leftCode: Record<string, string>
  rightAddress: string
  rightCode: Record<string, string>
  editorKey?: string
}

export function DiffView(props: DiffViewProps) {
  const monacoEl = useRef(null)
  const { setDiffEditor, getDiffEditor } = useCodeStore()
  const editorKey = props.editorKey ?? 'default'
  const editor = getDiffEditor(editorKey)
  const [fold, setFold] = useState(false)
  const [swapped, setSwapped] = useState(false)
  const [removeUnchanged, setRemoveUnchanged] = useState(
    !codeIsTheSame(props.leftCode, props.rightCode),
  )
  const [diff, setDiff] = useState<Diff | undefined>(undefined)

  const [leftAddress, rightAddress] = swapped
    ? [props.rightAddress, props.leftAddress]
    : [props.leftAddress, props.rightAddress]

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
    const [splitLeft, splitRight] = splitCode(
      props.leftCode,
      props.rightCode,
      removeUnchanged,
    )
    editor?.setDiff(splitLeft, splitRight)
  }, [editor, props.leftCode, props.rightCode, removeUnchanged])

  editor?.onComputedDiff(setDiff)

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
  const [leftCode, rightCode] = splitCode(left, right, false)
  return leftCode === rightCode
}
