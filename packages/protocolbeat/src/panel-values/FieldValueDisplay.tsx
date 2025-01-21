import clsx from 'clsx'
import type { ReactNode } from 'react'
import type { FieldValue } from '../api/types'
import { AddressDisplay } from './AddressDisplay'

export interface FieldValueDisplayProps {
  name?: string
  topLevel?: boolean
  value: FieldValue
}

export function FieldValueDisplay({
  name,
  topLevel,
  value,
}: FieldValueDisplayProps) {
  let inlineDisplay: ReactNode = null
  let blockDisplay: ReactNode = null

  if (value.type === 'address') {
    inlineDisplay = <AddressDisplay value={value} />
  } else if (value.type === 'hex') {
    if (value.value.length <= 66) {
      inlineDisplay = (
        <div className="flex font-mono text-coffee-400 text-xs">
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
    const QUOT_OPEN = '\u201C'
    const QUOT_CLOSE = '\u201D'
    inlineDisplay = (
      <p className="break-words font-serif">
        <strong
          className={clsx(
            'select-none text-coffee-600',
            topLevel && '-ml-[6px] inline-block',
          )}
        >
          {QUOT_OPEN}
        </strong>
        {value.value}
        <strong className="select-none text-coffee-600">{QUOT_CLOSE}</strong>
      </p>
    )
  } else if (value.type === 'number') {
    const fmt = Intl.NumberFormat('en-US')
    inlineDisplay = (
      <p className="overflow-hidden break-words font-mono text-aux-orange">
        {fmt.format(BigInt(value.value))}
      </p>
    )
  } else if (value.type === 'boolean') {
    inlineDisplay = (
      <p className="font-bold font-mono text-aux-orange text-xs uppercase">
        {value.value.toString()}
      </p>
    )
  } else if (value.type === 'array') {
    if (value.values.length !== 0) {
      blockDisplay = (
        <ol start={0} className="list-decimal pl-4 marker:text-coffee-600">
          {value.values.map((value, i) => (
            <FieldValueDisplay key={i} value={value} />
          ))}
        </ol>
      )
    } else {
      inlineDisplay = <span className="text-coffee-600">empty array</span>
    }
  } else if (value.type === 'object') {
    const entries = Object.entries(value.value)
    if (entries.length !== 0) {
      blockDisplay = (
        <ul className="list-disc pl-4 marker:font-mono marker:text-coffee-600 marker:text-xs">
          {entries.map(([key, value], i) => (
            <FieldValueDisplay key={i} name={key} value={value} />
          ))}
        </ul>
      )
    } else {
      inlineDisplay = <span className="text-coffee-600">empty object</span>
    }
  } else if (value.type === 'unknown') {
    inlineDisplay = value.value
  } else if (value.type === 'error') {
    inlineDisplay = `Error: ${value.error}`
  }

  if (topLevel) {
    return (
      <>
        {inlineDisplay && <div>{inlineDisplay}</div>}
        {blockDisplay}
      </>
    )
  }

  return (
    <li className="text-sm">
      {name && (
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-2">
          <p className="w-max font-mono text-xs">{name}:</p>
          {inlineDisplay}
        </div>
      )}
      {!name && inlineDisplay && <div>{inlineDisplay}</div>}
      {blockDisplay}
    </li>
  )
}
