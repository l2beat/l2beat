import { memo, type ReactNode } from 'react'
import type { FieldValue } from '../../../api/types'
import { AddressDisplay } from './AddressDisplay'
import { groupDigits } from './groupDigits'

const EM_DASH = '—'
export const HEX_WORD_LENGTH = 66

export interface FieldValueDisplayProps {
  name?: FieldValue
  index?: number
  indexDigits?: number
  topLevel?: boolean
  value: FieldValue
}

// Values come straight from the project query and never change in place, while
// the fields around them rerender whenever the config or template loads.
export const FieldValueDisplay = memo(function FieldValueDisplay({
  name,
  index,
  indexDigits,
  topLevel,
  value,
}: FieldValueDisplayProps) {
  let inlineDisplay: ReactNode = null
  let blockDisplay: ReactNode = null

  if (value.type === 'address') {
    inlineDisplay = <AddressDisplay value={value} />
  } else if (value.type === 'hex') {
    if (value.value.length <= HEX_WORD_LENGTH) {
      inlineDisplay = (
        <div className="break-all font-mono text-coffee-400 text-xs">
          {value.value}
        </div>
      )
    } else {
      const parts: string[] = []
      for (let i = 2; i < value.value.length; i += 64) {
        parts.push(value.value.slice(i, i + 64))
      }
      inlineDisplay = (
        <div className="flex font-mono text-coffee-400 text-xs">
          <span>0x</span>
          <div>
            {parts.map((part, i) => (
              <div key={i}>{part}</div>
            ))}
          </div>
        </div>
      )
    }
  } else if (value.type === 'string') {
    inlineDisplay = (
      <p className="wrap-break-word font-mono text-coffee-200 text-xs">
        <span className="select-none text-coffee-500">"</span>
        {value.value}
        <span className="select-none text-coffee-500">"</span>
      </p>
    )
  } else if (value.type === 'number') {
    inlineDisplay = (
      <p className="wrap-anywhere font-mono text-aux-orange text-xs">
        <GroupedDigits text={BigInt(value.value).toString()} />
      </p>
    )
  } else if (value.type === 'boolean') {
    inlineDisplay = (
      <p className="font-mono text-aux-orange text-xs">
        {value.value.toString()}
      </p>
    )
  } else if (value.type === 'array') {
    if (value.values.length !== 0) {
      blockDisplay = (
        <ol className="border-coffee-600 border-l pl-3">
          {value.values.map((item, i) => (
            <FieldValueDisplay
              key={i}
              index={i}
              indexDigits={String(value.values.length - 1).length}
              value={item}
            />
          ))}
        </ol>
      )
    } else {
      inlineDisplay = (
        <span className="font-mono text-coffee-400 text-xs">empty array</span>
      )
    }
  } else if (value.type === 'object') {
    const entries = value.values
    if (entries.length !== 0) {
      blockDisplay = (
        <ul className="border-coffee-600 border-l pl-3">
          {entries.map(([key, value], i) => (
            <FieldValueDisplay key={i} name={key} value={value} />
          ))}
        </ul>
      )
    } else {
      inlineDisplay = (
        <span className="font-mono text-coffee-400 text-xs">empty object</span>
      )
    }
  } else if (value.type === 'unknown') {
    inlineDisplay = (
      <span className="wrap-anywhere font-mono text-coffee-300 text-xs">
        {value.value}
      </span>
    )
  } else if (value.type === 'error') {
    inlineDisplay = (
      <span className="wrap-anywhere font-mono text-aux-red text-xs">
        Error: {value.error}
      </span>
    )
  } else if (value.type === 'empty') {
    inlineDisplay = <span className="text-coffee-400 text-xs">{EM_DASH}</span>
  }

  if (topLevel) {
    return (
      <>
        {inlineDisplay && <div>{inlineDisplay}</div>}
        {blockDisplay}
      </>
    )
  }

  const nameNode = getNameNode(name, index, indexDigits)

  return (
    <li className="text-xs leading-5">
      {nameNode && (
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-2">
          {nameNode}
          {inlineDisplay}
        </div>
      )}
      {!nameNode && inlineDisplay && <div>{inlineDisplay}</div>}
      {blockDisplay}
    </li>
  )
})

function GroupedDigits({ text }: { text: string }) {
  // Margins instead of separator characters keep copied numbers intact.
  return groupDigits(text).map((group, i) => (
    <span key={i} className="not-first:ml-[0.35em]">
      {group}
    </span>
  ))
}

function getNameNode(
  name: FieldValue | undefined,
  index: number | undefined,
  indexDigits: number | undefined,
) {
  if (name?.type === 'string') {
    return (
      <span className="font-medium font-mono text-coffee-300 text-xs">
        {name.value}:
      </span>
    )
  }
  if (name) {
    return <FieldValueDisplay value={name} topLevel />
  }
  if (index !== undefined) {
    return (
      <span
        className="inline-block select-none text-right font-mono text-coffee-400 text-xs tabular-nums"
        style={{ minWidth: `${indexDigits ?? 1}ch` }}
      >
        {index}
      </span>
    )
  }
  return null
}
