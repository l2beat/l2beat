import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { useRef } from 'react'
import { IconArrowToDotDown } from '../../icons/IconArrowToDotDown'
import { IconArrowToDotUp } from '../../icons/IconArrowToDotUp'
import { IconFoldVertical } from '../../icons/IconFoldVertical'
import { IconSplit } from '../../icons/IconSplit'
import { IconSwap } from '../../icons/IconSwap'
import { DiffEditor } from './diffEditor'
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
  const [removeUnchanged, setRemoveUnchanged] = useState(true)

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

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative z-10 flex w-full items-center bg-coffee-900 shadow-[0_2px_4px_0_black]">
        <div className="flex-1 py-2 text-center font-mono">{leftAddress}</div>
        <div className="flex-1 py-2 text-center font-mono">{rightAddress}</div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-100 flex gap-1">
          <button
            className={clsx(
              'block p-0.5',
              removeUnchanged && 'rounded bg-autumn-300 text-coffee-800',
            )}
            onClick={() => setRemoveUnchanged(!removeUnchanged)}
          >
            <IconSplit className="size-5" />
          </button>
          <button
            className={clsx(
              'block p-0.5',
              fold && 'rounded bg-autumn-300 text-coffee-800',
            )}
            onClick={() => {
              editor?.setFolding(!fold)
              setFold(!fold)
            }}
          >
            <IconFoldVertical className="size-5" />
          </button>
          <button
            className={clsx(
              'block p-0.5',
              swapped && 'rounded bg-autumn-300 text-coffee-800',
            )}
            // TODO(radomski): On swap change the URL, don't style the button
            onClick={() => setSwapped(editor?.swapSides() ?? false)}
          >
            <IconSwap className="size-5" />
          </button>
          <button className="block p-0.5" onClick={() => editor?.toNextDiff()}>
            <IconArrowToDotDown className="size-5" />
          </button>
          <button
            className="block p-0.5"
            onClick={() => editor?.toPreviousDiff()}
          >
            <IconArrowToDotUp className="size-5" />
          </button>
        </div>
      </div>
      <div className="h-1 bg-coffee-900" />
      <div className="h-full w-full" ref={monacoEl} />
    </div>
  )
}
